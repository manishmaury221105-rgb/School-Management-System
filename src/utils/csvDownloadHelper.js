/**
 * Universal CSV Download & Share Helper for Web, Mobile Safari, Android & Capacitor iOS
 */
export async function triggerCsvDownload(csvString, filename, title = 'EduSphere CSV Export') {
  try {
    const isCapacitor = typeof window !== 'undefined' && !!(window.Capacitor?.isNativePlatform?.() || window.Capacitor);
    const isIOS = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
    const isMobile = typeof navigator !== 'undefined' && (
      isIOS || /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const file = new File([blob], filename, { type: 'text/csv' });

    // 1. Native Web Share on Mobile/iOS (Save to Files / Share sheet)
    if ((isIOS || isCapacitor || isMobile) && typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: title || filename,
          text: `CSV Export: ${filename}`,
          files: [file],
        });
        return { success: true, method: 'native_share' };
      } catch (shareErr) {
        if (shareErr && shareErr.name === 'AbortError') {
          return { success: true, cancelled: true };
        }
        console.warn('Native share dismissed or failed, proceeding with blob download fallback:', shareErr);
      }
    }

    // 2. Standard Blob Link Download
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch {}
    }, 2000);

    return { success: true, method: 'download' };
  } catch (err) {
    console.error('Trigger CSV Download error:', err);
    return { success: false, error: err };
  }
}
