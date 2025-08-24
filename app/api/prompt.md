1. see the localhost:3001/dash is blank due to some reason, with just this warning, "The resource http://localhost:3001/_next/static/chunks/webpack.js?v=1756027519780 was preloaded using link preload but not used within a few seconds from the window's load event. Please make sure it has an appropriate `as` value and it is preloaded intentionally." and our build failed with this response, "PS D:\Pull from Github\JanVaani-ws\HaveWave2.0> cd "d:\Pull from Github\JanVaani-ws\HaveWave2.0"; npm run build

> my-v0-project@0.1.0 build
> next build

   ▲ Next.js 15.2.4
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully
   Skipping validation of types
   Skipping linting
 ✓ Collecting page data    
 ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/auth/verify-otp". Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout   
    at a (D:\Pull from Github\JanVaani-ws\HaveWave2.0\.next\server\chunks\950.js:3:11551)
    at f (D:\Pull from Github\JanVaani-ws\HaveWave2.0\.next\server\chunks\950.js:5:28490)
    at i (D:\Pull from Github\JanVaani-ws\HaveWave2.0\.next\server\app\auth\verify-otp\page.js:7:427)
    at nL (D:\Pull from Github\JanVaani-ws\HaveWave2.0\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:76:46773)
    at nF (D:\Pull from Github\JanVaani-ws\HaveWave2.0\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:76:48548)
    at nq (D:\Pull from Github\JanVaani-ws\HaveWave2.0\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:76:67434)
    at nH (D:\Pull from Github\JanVaani-ws\HaveWave2.0\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:76:65009)
    at nU (D:\Pull from Github\JanVaani-ws\HaveWave2.0\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:76:47125)
    at nF (D:\Pull from Github\JanVaani-ws\HaveWave2.0\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:76:48594)
    at nF (D:\Pull from Github\JanVaani-ws\HaveWave2.0\node_modules\next\dist\compiled\next-server\app-page.runtime.prod.js:76:64360)
Error occurred prerendering page "/auth/verify-otp". Read more: https://nextjs.org/docs/messages/prerender-error
Export encountered an error on /auth/verify-otp/page: /auth/verify-otp, exiting the build.
 ⨯ Next.js build worker exited with code: 1 and signal: null". Its 