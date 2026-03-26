import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const CREDITS_PER_EDIT = 2;

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, imageBase64, imageMimeType } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string', success: false },
        { status: 400 }
      );
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json(
        { error: 'Image is required. Please upload an image to edit.', success: false },
        { status: 400 }
      );
    }

    const mimeType = imageMimeType || 'image/jpeg';
    const imageDataUri = `data:${mimeType};base64,${imageBase64}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Server configuration error: Supabase credentials not configured', success: false },
        { status: 500 }
      );
    }

    const supabaseAuth = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Please sign in to edit images. Create a free account to get started!', success: false },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid authentication token. Please sign in again.', success: false },
        { status: 401 }
      )
    }

    let remainingCredits: number | undefined;
    const userId: string = user.id;

    // Deduct 2 credits before generation
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return NextResponse.json(
          { error: 'Failed to fetch user profile', success: false },
          { status: 500 }
        );
      }

      if (!profile || profile.credits < CREDITS_PER_EDIT) {
        return NextResponse.json(
          { error: `Insufficient credits. Image editing costs ${CREDITS_PER_EDIT} credits. Please purchase more to continue.`, success: false },
          { status: 402 }
        );
      }

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          credits: profile.credits - CREDITS_PER_EDIT,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .eq('credits', profile.credits)
        .select()
        .single();

      if (updateError || !updatedProfile) {
        return NextResponse.json(
          { error: 'Credit check failed, please try again', success: false },
          { status: 409 }
        );
      }

      remainingCredits = updatedProfile.credits;
      console.log(`✅ ${CREDITS_PER_EDIT} credits deducted. Remaining:`, updatedProfile.credits);
    } catch (error: unknown) {
      console.error('Error deducting credits:', error);
      return NextResponse.json(
        { error: 'Failed to deduct credits', success: false },
        { status: 500 }
      );
    }

    console.log('📥 Edit request received:', {
      prompt: prompt?.substring(0, 50) + '...',
      mimeType,
      timestamp: new Date().toISOString(),
    });

    try {
      console.log('🚀 Calling Replicate with runwayml/gen4-image-turbo...');

      const output = await replicate.run(
        "runwayml/gen4-image-turbo",
        {
          input: {
            prompt: prompt.trim(),
            reference_images: [imageDataUri],
          }
        }
      );

      // Extract image URL — comprehensive handling for all Replicate output formats
      let imageUrl: string | null = null;

      if (typeof output === 'string') {
        imageUrl = output;
      } else if (output instanceof URL) {
        imageUrl = output.toString();
      } else if (Array.isArray(output)) {
        if (output.length === 0) throw new Error('No image generated - empty array');
        const firstItem = output[0];
        if (typeof firstItem === 'string') {
          imageUrl = firstItem;
        } else if (firstItem instanceof URL) {
          imageUrl = firstItem.toString();
        } else if (firstItem && typeof firstItem === 'object') {
          if ('url' in firstItem) {
            const urlValue = firstItem.url;
            if (typeof urlValue === 'function') {
              const result = await urlValue();
              imageUrl = typeof result === 'string' ? result : result?.toString?.() || String(result);
            } else if (urlValue instanceof URL) {
              imageUrl = urlValue.toString();
            } else if (typeof urlValue === 'string') {
              imageUrl = urlValue;
            }
          } else if ('href' in firstItem) {
            const hrefValue = (firstItem as any).href;
            imageUrl = typeof hrefValue === 'string' ? hrefValue : hrefValue?.toString?.() || String(hrefValue);
          }
          if (!imageUrl && firstItem.toString && firstItem.toString !== Object.prototype.toString) {
            const str = firstItem.toString();
            if (typeof str === 'string' && str.startsWith('http')) imageUrl = str;
          }
        }
      } else if (output && typeof output === 'object') {
        if ('url' in output) {
          const urlValue = (output as any).url;
          if (typeof urlValue === 'function') {
            const result = await urlValue();
            imageUrl = typeof result === 'string' ? result : result?.toString?.() || String(result);
          } else if (urlValue instanceof URL) {
            imageUrl = urlValue.toString();
          } else if (typeof urlValue === 'string') {
            imageUrl = urlValue;
          }
        } else if ('href' in output) {
          const hrefValue = (output as any).href;
          imageUrl = typeof hrefValue === 'string' ? hrefValue : hrefValue?.toString?.() || String(hrefValue);
        }
        if (!imageUrl && output.toString && output.toString !== Object.prototype.toString) {
          const str = output.toString();
          if (typeof str === 'string' && str.startsWith('http')) imageUrl = str;
        }
        if (!imageUrl && (Symbol.asyncIterator in output)) {
          const items: any[] = [];
          for await (const item of output as AsyncIterable<any>) { items.push(item); }
          if (items.length > 0) {
            const firstItem = items[0];
            if (typeof firstItem === 'string') {
              imageUrl = firstItem;
            } else if (firstItem instanceof URL) {
              imageUrl = firstItem.toString();
            } else if (firstItem?.url) {
              const urlVal = typeof firstItem.url === 'function' ? await firstItem.url() : firstItem.url;
              imageUrl = typeof urlVal === 'string' ? urlVal : urlVal?.toString?.() || String(urlVal);
            }
          }
        }
      }

      if (imageUrl !== null && typeof imageUrl !== 'string') {
        imageUrl = String(imageUrl);
      }

      if (!imageUrl) {
        throw new Error('Could not extract image URL from Replicate response');
      }

      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        throw new Error('Invalid image URL format');
      }

      console.log('✅ Image edited successfully:', imageUrl);

      // Upload to Supabase Storage for permanent URL
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) throw new Error(`Failed to fetch Replicate output: ${imgRes.status}`);
      const imgBuffer = await imgRes.arrayBuffer();
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(fileName, imgBuffer, { contentType: 'image/jpeg', upsert: false });
      if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);
      const { data: { publicUrl } } = supabase.storage
        .from('generated-images')
        .getPublicUrl(fileName);
      if (!publicUrl) throw new Error('Failed to get public URL after upload');
      imageUrl = publicUrl;
      console.log('✅ Uploaded to Supabase Storage:', imageUrl);

      // Save to database (non-critical)
      let imageId: string | null = null;
      try {
        const { data: insertedImage, error: saveError } = await supabase
          .from('images')
          .insert({
            user_id: user.id,
            prompt: prompt.trim(),
            image_url: imageUrl,
            aspect_ratio: null,
            is_favorite: false,
          })
          .select()
          .single();

        if (saveError) {
          console.error('⚠️ Failed to save image to database:', saveError);
        } else {
          imageId = insertedImage?.id || null;
        }
      } catch (saveError) {
        console.error('⚠️ Failed to save image to database:', saveError);
      }

      return NextResponse.json({ imageUrl, imageId, success: true, remainingCredits });

    } catch (generationError: unknown) {
      // Restore 2 credits on generation failure
      try {
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        if (currentProfile) {
          await supabase
            .from('profiles')
            .update({
              credits: currentProfile.credits + CREDITS_PER_EDIT,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
          console.log(`✅ ${CREDITS_PER_EDIT} credits restored due to generation failure`);
        }
      } catch (restoreError) {
        console.error('❌ Failed to restore credits:', restoreError);
      }

      throw generationError;
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = (error as any).response;

    console.error('❌ Image edit error:', {
      message: errorMessage,
      status: errorResponse?.status,
    });

    if (errorMessage?.includes('REPLICATE_API_TOKEN')) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API token', success: false },
        { status: 500 }
      );
    }

    if (errorResponse?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a moment.', success: false },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to edit image. Please try again.', details: errorMessage, success: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST.' },
    { status: 405 }
  );
}
