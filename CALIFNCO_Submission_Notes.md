# CALIFNCO — Project Submission Notes

## Project
CALIFNCO is a React Native / Expo water purifier e-commerce prototype. The public source repository is:
https://github.com/abirami-77/califnco-water-purifier

Admin panel:
https://1-chi-henna.vercel.app

Final submission form:
https://docs.google.com/forms/d/e/1FAIpQLScmXkkKLAOCuqwMQrx5HBMrcj8wUNXZr5mOEbEF8SmfiqDRFQ/viewform

## Android APK
The Android debug APK was built locally at:
`android/app/build/outputs/apk/debug/app-debug.apk`

Paste the Google Drive share link for `app-debug.apk` here before submitting:
`[ADD YOUR GOOGLE DRIVE APK LINK HERE]`

Ensure the Drive sharing setting is **Anyone with the link — Viewer** and test the link in a private/incognito window.

## Automation workflow attempted in Make.com
A Make.com scenario was created with the following intended flow:
1. Google Sheets — Search Rows
2. Google Sheets — Update a Row (mark the row as Processing)
3. OpenAI — Write Caption
4. OpenAI — Generate Image
5. Cloudinary — Host Image
6. Instagram for Business — Publish Instagram
7. Google Sheets — Update a Row (mark as Posted)

Google Sheets was connected and a product row was prepared with these columns:
- ProductName
- Caption
- Status
- ImageURL

Cloudinary account setup was completed and a Cloudinary connection was selected in Make.com. The Cloudinary module was configured to accept an image URL, with a sample image URL used for the demo.

## Limitations / honest status
- The Make.com scenario was not confirmed end-to-end and was left inactive.
- OpenAI modules requested an API key; API-based caption and image generation were not completed.
- Instagram publishing was not connected because it requires a Facebook login, a Facebook Page with appropriate access, and a linked Instagram Business account. The account owner did not have a Facebook account at setup time.
- Therefore, automatic AI generation and live Instagram publishing should be described as attempted/incomplete, not as working features.
- The Cloudinary upload step was configured but end-to-end upload/publishing was not verified.

## Tools and technologies
- React Native / Expo
- Firebase (project integration files are present in the repository; describe only the Firebase features that have been tested)
- Vercel (admin panel deployment)
- Make.com (automation workflow prototype)
- Google Sheets (product/status tracking)
- Cloudinary (image hosting setup attempted)
- OpenAI and Instagram integrations (configuration attempted; incomplete)

## Suggested short submission note
“I built the CALIFNCO mobile application prototype using React Native and Expo, with a deployed admin panel. I also created a Make.com automation workflow integrating Google Sheets, OpenAI, Cloudinary and Instagram for Business. Google Sheets and Cloudinary setup were completed, while OpenAI API credentials and the required Facebook Page/Instagram Business connection prevented end-to-end automated posting. The scenario remains inactive, and I have documented the steps attempted and the remaining limitations transparently.”
