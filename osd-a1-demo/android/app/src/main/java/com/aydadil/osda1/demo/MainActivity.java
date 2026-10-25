package com.aydadil.osda1.demo;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.PermissionRequest;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.content.res.AssetManager;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * Independent AYDA A1 DEMO, never a payment or student-account client.
 * APK-bundled v0.9 web application and ZA1 guide are served inside WebView on
 * the original HTTPS demo origin. Preserves existing IndexedDB origin/data.
 * Only external HTTPS links leave for the system browser.
 */
public class MainActivity extends Activity {
    private static final String DEMO_URL = "https://ayda-osd-a1-demo.vercel.app/#/home";
    private static final String HOST = "ayda-osd-a1-demo.vercel.app";
    private static final int REQUEST_AUDIO = 2101;
    private static final int REQUEST_FILE = 2102;

    private WebView web;
    private LinearLayout offlinePanel;
    private ValueCallback<Uri[]> chooserResult;
    private PermissionRequest waitingMic;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(16,37,65));
        getWindow().setNavigationBarColor(Color.rgb(19,39,71));
        WebView.setWebContentsDebuggingEnabled(false);
        FrameLayout root = new FrameLayout(this);
        web = new WebView(this);
        root.addView(web,new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
        offlinePanel = makeOfflinePanel();
        offlinePanel.setVisibility(View.GONE);
        root.addView(offlinePanel,new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);
        configureWebView();
        configureBundledServiceWorker();
        if(savedInstanceState!=null) {
            web.restoreState(savedInstanceState);
        }else{
            web.loadUrl(DEMO_URL);
        }
    }

    private boolean trusted(Uri uri){
        return uri!=null&&"https".equalsIgnoreCase(uri.getScheme())
            &&HOST.equalsIgnoreCase(uri.getHost())&&(uri.getPort()==-1||uri.getPort()==443);
    }
    private void openExternally(Uri url){
        if(url==null||!"https".equalsIgnoreCase(url.getScheme()))return;
        try{startActivity(new Intent(Intent.ACTION_VIEW,url).addCategory(Intent.CATEGORY_BROWSABLE));}
        catch(ActivityNotFoundException ignored){showOffline("Bağlantıyı açabilecek bir tarayıcı bulunamadı.");}
    }


    /**
     * All web frontend files, the A1 exam guide and audio are embedded in this APK.
     * Intercepting the original HTTPS origin preserves IndexedDB and recording data
     * across a v0.8 to v0.9 APK update (unlike switching to file:// or appassets).
     * The APK does not require a new Vercel deployment to show the guide.
     */
    private WebResourceResponse bundledResponse(Uri uri, String method, String range) {
        if (!trusted(uri) || !"GET".equalsIgnoreCase(method)) return null;
        String path = uri.getPath();
        if(path == null || path.isEmpty() || "/".equals(path)) path = "/index.html";
        if("/rehber/a1/".equals(path)) path="/rehber/a1/index.html";
        // Disallow arbitrary file access or traversal through crafted URLs.
        if(!path.matches("/[A-Za-z0-9._/-]+") || path.contains("..") || path.contains("//")) return null;
        String filename="web"+path;
        try(InputStream input=getAssets().open(filename, AssetManager.ACCESS_STREAMING)) {
            String mime;
            if(path.endsWith(".html")) mime="text/html";
            else if(path.endsWith(".js")) mime="application/javascript";
            else if(path.endsWith(".css")) mime="text/css";
            else if(path.endsWith(".mp3")) mime="audio/mpeg";
            else if(path.endsWith(".json")) mime="application/json";
            else if(path.endsWith(".svg")) mime="image/svg+xml";
            else if(path.endsWith(".png")) mime="image/png";
            else if(path.endsWith(".jpg")||path.endsWith(".jpeg")) mime="image/jpeg";
            else if(path.endsWith(".webp")) mime="image/webp";
            else mime="application/octet-stream";
            Map<String,String> headers=new HashMap<>();
            headers.put("Cache-Control","no-cache");
            headers.put("Access-Control-Allow-Origin","https://"+HOST);
            // Android WebView may request ranges for MP3 playback.
            if(path.endsWith(".mp3") && range != null && range.startsWith("bytes=")) {
                ByteArrayOutputStream out=new ByteArrayOutputStream();
                byte[] buffer=new byte[8192];int n;
                while((n=input.read(buffer))!=-1)out.write(buffer,0,n);
                byte[] bytes=out.toByteArray();
                String[] values=range.substring(6).split("-",2);
                if(values.length!=2) return new WebResourceResponse(mime,null,416,"Range Not Satisfiable",headers,new ByteArrayInputStream(new byte[0]));
                try {
                    long from=values[0].isEmpty()?Math.max(0L,bytes.length-Long.parseLong(values[1])):Long.parseLong(values[0]);
                    long to=values[0].isEmpty()?bytes.length-1L:(values[1].isEmpty()?bytes.length-1L:Math.min(bytes.length-1L,Long.parseLong(values[1])));
                    if(from<0 || from>=bytes.length || to<from || to>=bytes.length) return new WebResourceResponse(mime,null,416,"Range Not Satisfiable",headers,new ByteArrayInputStream(new byte[0]));
                    int start=(int)from,length=(int)(to-from+1);
                    headers.put("Content-Range","bytes "+start+"-"+to+"/"+bytes.length);
                    headers.put("Accept-Ranges","bytes");
                    headers.put("Content-Length",String.valueOf(length));
                    return new WebResourceResponse(mime,null,206,"Partial Content",headers,new ByteArrayInputStream(bytes,start,length));
                }catch(NumberFormatException error){
                    return new WebResourceResponse(mime,null,416,"Range Not Satisfiable",headers,new ByteArrayInputStream(new byte[0]));
                }
            }
            return new WebResourceResponse(mime,"UTF-8",200,"OK",headers,getAssets().open(filename,AssetManager.ACCESS_STREAMING));
        }catch(IOException missing){
            // Only absent assets fall back to the previous hosted demo source.
            return null;
        }
    }

    private void configureBundledServiceWorker(){
        // Service Worker (offline shell) requests need the same bundled interception.
        ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient(){
            @Override public WebResourceResponse shouldInterceptRequest(WebResourceRequest request){
                return bundledResponse(request.getUrl(), request.getMethod(), request.getRequestHeaders().get("Range"));
            }
        });
    }

    private void configureWebView(){
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true); // IndexedDB: records remain on this device
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(true); // Android file chooser content:// URIs
        web.getSettings().setMixedContentMode(android.webkit.WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        web.getSettings().setJavaScriptCanOpenWindowsAutomatically(false);
        web.getSettings().setSupportMultipleWindows(false);
        web.getSettings().setMediaPlaybackRequiresUserGesture(true);
        web.getSettings().setSafeBrowsingEnabled(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);

        web.setWebViewClient(new WebViewClient(){
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
                return bundledResponse(request.getUrl(),request.getMethod(),request.getRequestHeaders().get("Range"));
            }

            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){
                Uri uri=request.getUrl();
                if(trusted(uri))return false;
                openExternally(uri);
                return true;
            }
            @Override public void onPageFinished(WebView view,String url){
                if(trusted(Uri.parse(url)))offlinePanel.setVisibility(View.GONE);
            }
            @Override public void onReceivedError(WebView view,WebResourceRequest request,WebResourceError error){
                if(request.isForMainFrame())showOffline("İnternet bağlantısı kurulamadı. Yeniden deneyebilir veya bağlantıyı kontrol edebilirsin.");
            }
            @Override public void onReceivedSslError(WebView view,SslErrorHandler handler,SslError error){
                handler.cancel(); // never bypass TLS verification
                showOffline("Güvenli HTTPS bağlantısı doğrulanamadı. Saat ve internet ayarlarını kontrol et.");
            }
        });

        web.setWebChromeClient(new WebChromeClient(){
            @Override public void onPermissionRequest(PermissionRequest request){
                runOnUiThread(()->{
                    if(!trusted(request.getOrigin()) || !trusted(Uri.parse(web.getUrl()==null?"":web.getUrl()))){
                        request.deny();return;
                    }
                    boolean wantsAudio=false;
                    for(String resource:request.getResources())
                        if(PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource))wantsAudio=true;
                    if(!wantsAudio){request.deny();return;}
                    if(checkSelfPermission(Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED){
                        request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                    }else{
                        if(waitingMic!=null)waitingMic.deny();
                        waitingMic=request;
                        requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO},REQUEST_AUDIO);
                    }
                });
            }
            @Override public void onPermissionRequestCanceled(PermissionRequest request){
                if(waitingMic==request)waitingMic=null;
            }
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params){
                if(chooserResult!=null)chooserResult.onReceiveValue(null);
                chooserResult=callback;
                try{
                    Intent intent=new Intent(Intent.ACTION_GET_CONTENT);
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    intent.setType("*/*");
                    intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE,params.getMode()==FileChooserParams.MODE_OPEN_MULTIPLE);
                    startActivityForResult(Intent.createChooser(intent,"Dosya seç"),REQUEST_FILE);
                    return true;
                }catch(ActivityNotFoundException ignored){
                    chooserResult.onReceiveValue(null);chooserResult=null;return false;
                }
            }
        });
    }

    private LinearLayout makeOfflinePanel(){
        LinearLayout column=new LinearLayout(this);
        column.setOrientation(LinearLayout.VERTICAL);
        column.setGravity(Gravity.CENTER);
        column.setPadding(38,30,38,30);
        column.setBackgroundColor(Color.rgb(245,248,252));
        TextView heading=new TextView(this);
        heading.setText("AYDA ÖSD A1 — Çevrim dışı");
        heading.setTextColor(Color.rgb(27,55,87));
        heading.setTextSize(21);
        heading.setTypeface(null,Typeface.BOLD);
        column.addView(heading);
        TextView note=new TextView(this);
        note.setId(android.R.id.message);
        note.setText("İnternete bağlanıp tekrar dene. Daha önce önbelleğe alınmış çalışmalar çevrim dışı açılabilir.");
        note.setTextSize(14);
        note.setTextColor(Color.rgb(84,109,134));
        note.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams noteParams=new LinearLayout.LayoutParams(-1,-2);
        noteParams.topMargin=20; noteParams.bottomMargin=22;
        column.addView(note,noteParams);
        Button retry=new Button(this);
        retry.setText("Yeniden dene");
        retry.setOnClickListener(v->{offlinePanel.setVisibility(View.GONE);web.loadUrl(DEMO_URL);});
        column.addView(retry);
        return column;
    }

    private void showOffline(String message){
        TextView note=offlinePanel.findViewById(android.R.id.message);
        if(note!=null)note.setText(message);
        offlinePanel.setVisibility(View.VISIBLE);
    }

    @Override public void onRequestPermissionsResult(int requestCode,String[] permissions,int[] results){
        super.onRequestPermissionsResult(requestCode,permissions,results);
        if(requestCode==REQUEST_AUDIO && waitingMic!=null){
            PermissionRequest request=waitingMic;
            waitingMic=null;
            if(results.length>0&&results[0]==PackageManager.PERMISSION_GRANTED
                    &&trusted(request.getOrigin())&&trusted(Uri.parse(web.getUrl()==null?"":web.getUrl())))
                request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
            else request.deny();
        }
    }
    @Override protected void onActivityResult(int requestCode,int resultCode,Intent data){
        super.onActivityResult(requestCode,resultCode,data);
        if(requestCode==REQUEST_FILE && chooserResult!=null){
            chooserResult.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode,data));
            chooserResult=null;
        }
    }
    @Override public void onBackPressed(){
        if(offlinePanel.getVisibility()==View.VISIBLE){
            offlinePanel.setVisibility(View.GONE);web.loadUrl(DEMO_URL);
        }else if(web.canGoBack()){
            web.goBack();
        }else if(web.getUrl()!=null&&!web.getUrl().endsWith("#/home")){
            web.loadUrl(DEMO_URL);
        }else{
            super.onBackPressed();
        }
    }
    @Override protected void onSaveInstanceState(Bundle state){
        web.saveState(state);super.onSaveInstanceState(state);
    }
    @Override protected void onDestroy(){
        if(chooserResult!=null){chooserResult.onReceiveValue(null);chooserResult=null;}
        if(waitingMic!=null){waitingMic.deny();waitingMic=null;}
        if(web!=null){web.destroy();web=null;}
        super.onDestroy();
    }
}
