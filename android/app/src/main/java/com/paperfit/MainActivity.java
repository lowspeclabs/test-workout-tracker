package com.paperfit;

import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import android.app.Activity;

public class MainActivity extends Activity {

    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.webview);
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true); // For LocalStorage

        // Expose Native interface to JS
        mWebView.addJavascriptInterface(new WebAppInterface(this), "Android");

        // Load the web app
        // In a real scenario, this points to the hosted URL
        // For development, it might point to your local machine IP if connected via adb
        // mWebView.loadUrl("http://10.0.2.2:3000"); // Standard Android Emulator localhost alias
        mWebView.loadUrl("https://your-site.com");

        mWebView.setWebViewClient(new WebViewClient());
    }

    @Override
    public void onBackPressed() {
        if (mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    public class WebAppInterface {
        Activity mActivity;

        WebAppInterface(Activity c) {
            mActivity = c;
        }

        @JavascriptInterface
        public void showToast(String toast) {
            Toast.makeText(mActivity, toast, Toast.LENGTH_SHORT).show();
        }

        @JavascriptInterface
        public String getAppVersion() {
            return "1.0.0";
        }

        @JavascriptInterface
        public void requestNotificationPermission() {
             // Implementation for permission request
             Toast.makeText(mActivity, "Requesting Notification Permission...", Toast.LENGTH_SHORT).show();
        }
    }
}
