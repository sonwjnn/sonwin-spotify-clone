import { useSupabaseClient } from '@supabase/auth-helpers-react'

export const useLoadImage = (
  imagePath: string,
  bucket: string
): string | null => {
  const supabaseClient = useSupabaseClient()
  if (!imagePath || !bucket) return null

  const { data: imageData } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(imagePath)

  return imageData.publicUrl
}
