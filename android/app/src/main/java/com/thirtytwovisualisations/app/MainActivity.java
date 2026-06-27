package com.thirtytwovisualisations.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.AssetFileDescriptor;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.DocumentsContract;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class MainActivity extends Activity {
    private static final int REQUEST_OPEN_TREE = 3200;
    private static final String PREFS = "visualisations";
    private static final String PREF_TREE_URI = "treeUri";
    private static final String APP_ORIGIN = "https://visualisations.local";

    private WebView webView;
    private SharedPreferences preferences;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);

        preferences = getSharedPreferences(PREFS, MODE_PRIVATE);
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);

        webView.setWebViewClient(new LocalWebViewClient());
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidWaveDeck");
        setContentView(webView);
        enterImmersiveMode();
        webView.loadUrl(APP_ORIGIN + "/index.html");
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            enterImmersiveMode();
        }
    }

    private void enterImmersiveMode() {
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        );
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode != REQUEST_OPEN_TREE || resultCode != RESULT_OK || data == null || data.getData() == null) {
            notifyFolderSelection(false);
            return;
        }

        Uri treeUri = data.getData();
        int flags = data.getFlags() & (Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
        getContentResolver().takePersistableUriPermission(treeUri, flags & Intent.FLAG_GRANT_READ_URI_PERMISSION);
        preferences.edit().putString(PREF_TREE_URI, treeUri.toString()).apply();
        notifyFolderSelection(true);
    }

    private void notifyFolderSelection(boolean selected) {
        String script = selected
            ? "window.waveDeckAndroidFolderSelected && window.waveDeckAndroidFolderSelected();"
            : "window.waveDeckAndroidFolderCancelled && window.waveDeckAndroidFolderCancelled();";
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    private JSONObject buildLibrary() throws JSONException {
        String storedTreeUri = preferences.getString(PREF_TREE_URI, "");
        JSONObject library = new JSONObject();
        library.put("directoryName", "Android music folder");
        JSONArray tracks = new JSONArray();
        library.put("tracks", tracks);

        if (storedTreeUri == null || storedTreeUri.isEmpty()) {
            return library;
        }

        Uri treeUri = Uri.parse(storedTreeUri);
        String rootDocumentId = DocumentsContract.getTreeDocumentId(treeUri);
        collectTracks(treeUri, rootDocumentId, "", tracks);
        return library;
    }

    private void collectTracks(Uri treeUri, String documentId, String prefix, JSONArray tracks) throws JSONException {
        ContentResolver resolver = getContentResolver();
        Uri childrenUri = DocumentsContract.buildChildDocumentsUriUsingTree(treeUri, documentId);
        String[] projection = new String[] {
            DocumentsContract.Document.COLUMN_DOCUMENT_ID,
            DocumentsContract.Document.COLUMN_DISPLAY_NAME,
            DocumentsContract.Document.COLUMN_MIME_TYPE,
            DocumentsContract.Document.COLUMN_LAST_MODIFIED
        };

        try (Cursor cursor = resolver.query(childrenUri, projection, null, null, DocumentsContract.Document.COLUMN_DISPLAY_NAME)) {
            if (cursor == null) {
                return;
            }

            while (cursor.moveToNext()) {
                String childDocumentId = cursor.getString(0);
                String name = cursor.getString(1);
                String mimeType = cursor.getString(2);
                long lastModified = cursor.getLong(3);

                if (DocumentsContract.Document.MIME_TYPE_DIR.equals(mimeType)) {
                    collectTracks(treeUri, childDocumentId, prefix + name + "/", tracks);
                } else if (name != null && name.toLowerCase().endsWith(".wav")) {
                    Uri audioUri = DocumentsContract.buildDocumentUriUsingTree(treeUri, childDocumentId);
                    JSONObject track = new JSONObject();
                    track.put("name", name);
                    track.put("relativePath", prefix + name);
                    track.put("lastModified", lastModified);
                    track.put("audioUrl", APP_ORIGIN + "/audio?uri=" + Uri.encode(audioUri.toString()));
                    tracks.put(track);
                }
            }
        }
    }

    private WebResourceResponse response(String mimeType, String encoding, InputStream stream) {
        return response(mimeType, encoding, 200, "OK", new HashMap<>(), stream);
    }

    private WebResourceResponse response(
        String mimeType,
        String encoding,
        int statusCode,
        String reasonPhrase,
        Map<String, String> extraHeaders,
        InputStream stream
    ) {
        Map<String, String> headers = new HashMap<>(extraHeaders);
        headers.put("Access-Control-Allow-Origin", "*");
        headers.put("Accept-Ranges", "bytes");
        headers.put("Cache-Control", "no-store");
        return new WebResourceResponse(mimeType, encoding, statusCode, reasonPhrase, headers, stream);
    }

    private WebResourceResponse notFound() {
        return new WebResourceResponse("text/plain", "UTF-8", 404, "Not found", new HashMap<>(), null);
    }

    private WebResourceResponse serveAudio(Uri audioUri, String rangeHeader) throws IOException {
        AssetFileDescriptor descriptor = getContentResolver().openAssetFileDescriptor(audioUri, "r");
        if (descriptor == null) {
            return notFound();
        }

        long length = descriptor.getLength();
        long start = 0;
        long end = length > 0 ? length - 1 : -1;
        boolean partial = false;

        if (rangeHeader != null && rangeHeader.startsWith("bytes=")) {
            String requested = rangeHeader.substring("bytes=".length());
            String[] parts = requested.split("-", 2);
            try {
                start = parts[0].isEmpty() ? 0 : Long.parseLong(parts[0]);
                if (parts.length > 1 && !parts[1].isEmpty()) {
                    end = Long.parseLong(parts[1]);
                }
                partial = true;
            } catch (NumberFormatException error) {
                start = 0;
                end = length > 0 ? length - 1 : -1;
                partial = false;
            }
        }

        if (length > 0) {
            start = Math.max(0, Math.min(start, length - 1));
            end = end < 0 ? length - 1 : Math.max(start, Math.min(end, length - 1));
        }

        InputStream stream = descriptor.createInputStream();
        long skipped = stream.skip(start);
        while (skipped < start) {
            long next = stream.skip(start - skipped);
            if (next <= 0) {
                break;
            }
            skipped += next;
        }

        Map<String, String> headers = new HashMap<>();
        if (length > 0) {
            long contentLength = end - start + 1;
            headers.put("Content-Length", Long.toString(contentLength));
            if (partial) {
                headers.put("Content-Range", "bytes " + start + "-" + end + "/" + length);
            }
            stream = new LimitedInputStream(stream, contentLength);
        }

        return response(
            "audio/wav",
            null,
            partial ? 206 : 200,
            partial ? "Partial Content" : "OK",
            headers,
            stream
        );
    }

    private class LocalWebViewClient extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri uri = request.getUrl();
            if (!"visualisations.local".equals(uri.getHost())) {
                return super.shouldInterceptRequest(view, request);
            }

            try {
                String path = uri.getPath();
                if (path == null || "/".equals(path)) {
                    path = "/index.html";
                }

                if ("/audio".equals(path)) {
                    String audioUri = uri.getQueryParameter("uri");
                    if (audioUri == null || audioUri.isEmpty()) {
                        return notFound();
                    }
                    String rangeHeader = request.getRequestHeaders().get("Range");
                    return serveAudio(Uri.parse(audioUri), rangeHeader);
                }

                String assetPath = "www" + path;
                String mimeType = "text/plain";
                if (assetPath.endsWith(".html")) {
                    mimeType = "text/html";
                } else if (assetPath.endsWith(".css")) {
                    mimeType = "text/css";
                } else if (assetPath.endsWith(".js")) {
                    mimeType = "text/javascript";
                }
                return response(mimeType, "UTF-8", getAssets().open(assetPath));
            } catch (FileNotFoundException error) {
                return notFound();
            } catch (IOException error) {
                return notFound();
            }
        }
    }

    private static class LimitedInputStream extends InputStream {
        private final InputStream source;
        private long remaining;

        LimitedInputStream(InputStream source, long remaining) {
            this.source = source;
            this.remaining = remaining;
        }

        @Override
        public int read() throws IOException {
            if (remaining <= 0) {
                return -1;
            }
            int value = source.read();
            if (value >= 0) {
                remaining -= 1;
            }
            return value;
        }

        @Override
        public int read(byte[] buffer, int offset, int length) throws IOException {
            if (remaining <= 0) {
                return -1;
            }
            int requested = (int) Math.min(length, remaining);
            int count = source.read(buffer, offset, requested);
            if (count > 0) {
                remaining -= count;
            }
            return count;
        }

        @Override
        public void close() throws IOException {
            source.close();
        }
    }

    public class AndroidBridge {
        @JavascriptInterface
        public String getLibrary() {
            try {
                return buildLibrary().toString();
            } catch (Exception error) {
                return "{\"directoryName\":\"Android music folder\",\"tracks\":[],\"error\":\"Android library could not be read.\"}";
            }
        }

        @JavascriptInterface
        public void chooseFolder() {
            runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
                    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
                    startActivityForResult(intent, REQUEST_OPEN_TREE);
                } catch (ActivityNotFoundException error) {
                    notifyFolderSelection(false);
                }
            });
        }
    }
}
