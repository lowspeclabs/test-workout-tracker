package com.paperfit;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.app.Activity;

/**
 * MainActivity
 *
 * This is the entry point for the Android application.
 * It functions as a shell that hosts a WebView to display the PaperFit web application.
 */
public class MainActivity extends Activity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize WebView
        webView = findViewById(R.id.webview);
        WebSettings webSettings = webView.getSettings();

        // Enable JavaScript as the React app requires it
        webSettings.setJavaScriptEnabled(true);

        // Enable DOM Storage to allow LocalStorage and SessionStorage to work
        webSettings.setDomStorageEnabled(true);

        // Expose the Native Android interface to JavaScript
        // This allows the web app to call `window.Android.methodName()`
        webView.addJavascriptInterface(new WebAppInterface(this), "Android");

        // Load the web application URL.
        // NOTE: For local development with the Android Emulator, use "http://10.0.2.2:3000"
        // to access the host machine's localhost.
        // For production, replace this with the actual hosted URL.
        webView.loadUrl("https://your-site.com");

        // Ensure links open within the WebView instead of the system browser
        webView.setWebViewClient(new WebViewClient());
    }

    /**
     * Handle the hardware back button.
     * If the WebView has a history (e.g. navigated to a new page), go back in history.
     * Otherwise, perform the default system behavior (close app).
     */
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    /**
     * WebAppInterface
     *
     * Defines the methods that are exposed to the JavaScript context.
     * These methods must be annotated with @JavascriptInterface.
     */
    public class WebAppInterface {
        Activity parentActivity;

        WebAppInterface(Activity activity) {
            parentActivity = activity;
        }

        /**
         * Show a native Android Toast message.
         * @param message The text to display.
         */
        @JavascriptInterface
        public void showToast(String message) {
            Toast.makeText(parentActivity, message, Toast.LENGTH_SHORT).show();
        }

        /**
         * Get the current version of the native app.
         * @return Version string.
         */
        @JavascriptInterface
        public String getAppVersion() {
            return "1.0.0";
        }

        /**
         * Request notification permissions (Mock implementation).
         */
        @JavascriptInterface
        public void requestNotificationPermission() {
             // In a real app, this would trigger the system permission dialog.
             Toast.makeText(parentActivity, "Requesting Notification Permission...", Toast.LENGTH_SHORT).show();
        }
    }
}
