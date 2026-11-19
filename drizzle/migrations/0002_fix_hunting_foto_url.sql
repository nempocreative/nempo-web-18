UPDATE public.media_archive
SET manifest = (
  SELECT jsonb_agg(
    CASE WHEN item->>'filename' = 'kalamuda-kegiatan-hunting-foto.jpg'
      THEN item || jsonb_build_object(
        'source_url', 'https://id-preview--e784d0fc-c27f-4e52-8e4e-b7a458eb48ad.lovable.app/__l5e/assets-v1/8f031030-5ec7-45d5-980c-7f3058a75a20/kalamuda-kegiatan-hunting-foto.jpg',
        'url', '/__l5e/assets-v1/8f031030-5ec7-45d5-980c-7f3058a75a20/kalamuda-kegiatan-hunting-foto.jpg')
      ELSE item END
  )
  FROM jsonb_array_elements(manifest) AS item
)
WHERE id = 'nempo-media-manifest';