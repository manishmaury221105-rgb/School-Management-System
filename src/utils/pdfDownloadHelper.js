/**
 * Universal PDF Download & Share Helper for Web, Mobile Safari, Android & Capacitor iOS
 */
export async function triggerPdfDownload(doc, filename, title = 'EduSphere Document') {
  try {
    const isCapacitor = typeof window !== 'undefined' && !!(window.Capacitor?.isNativePlatform?.() || window.Capacitor);
    const isIOS = typeof navigator !== 'undefined' && (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
    const isMobile = typeof navigator !== 'undefined' && (
      isIOS || /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );

    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], filename, { type: 'application/pdf' });

    // 1. On iOS Simulator / Physical iPhone / Capacitor or Mobile with Web Share API:
    // Native share allows user to "Save to Files", "Open in Safari/Books", "AirDrop", "Print", "WhatsApp", etc.
    if ((isIOS || isCapacitor || isMobile) && typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: title || filename,
          text: `Official Document: ${filename}`,
          files: [file],
        });
        return { success: true, method: 'native_share' };
      } catch (shareErr) {
        if (shareErr && shareErr.name === 'AbortError') {
          return { success: true, cancelled: true };
        }
        console.warn('Native share dismissed or failed, proceeding with direct download/open fallback:', shareErr);
      }
    }

    // 2. Standard Blob Link Download (for desktop & modern browsers)
    const blobUrl = URL.createObjectURL(pdfBlob);
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
      } catch (e) {}
    }, 2000);

    // 3. Fallback for iOS WKWebView where programmatic anchor downloads are blocked:
    if (isIOS || isCapacitor) {
      setTimeout(() => {
        try {
          const dataUri = doc.output('datauristring');
          const win = window.open(dataUri, '_blank');
          if (!win) {
            window.location.href = dataUri;
          }
        } catch (e) {
          console.warn('Data URI popup fallback error:', e);
        }
      }, 400);
    }

    return { success: true, method: 'download' };
  } catch (err) {
    console.error('Trigger PDF Download error:', err);
    try {
      doc.save(filename);
      return { success: true, method: 'doc_save' };
    } catch (saveErr) {
      console.error('doc.save fallback failed:', saveErr);
      return { success: false, error: err };
    }
  }
}

/**
 * Universal PDF Printing Helper
 */
export function triggerPdfPrint(doc) {
  try {
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = blobUrl;

    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch {
          window.open(blobUrl, '_blank');
        }
      }, 300);
    };
    return true;
  } catch (err) {
    console.error('PDF print failed:', err);
    window.print();
    return false;
  }
}
