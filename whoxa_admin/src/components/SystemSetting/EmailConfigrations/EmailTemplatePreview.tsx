import React, { useEffect, useRef, useState } from "react";
import useApiPost from "../../../hooks/PostData";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const EmailTemplatePreview = () => {
    const [template, setTemplate] = useState("");
    const [formData, setFormData] = useState({
        app_name: "",
        banner_image: "",
        website_link: "",
        apk_link: "",
        apple_link: "",
        base_url: "",
        copy_right: "",
        email_title: "",
    });
    const labels = {
        app_name: "App Name",
        website_link: "Website Link",
        apk_link: "Android App Link",
        apple_link: "iOS App Link",
        copy_right: "Copyright Text",
        email_title: "Email Title",
    };

    const [bannerFile, setBannerFile] = useState(null);

    const { loading, error, postData } = useApiPost();
    const iframeRef = useRef(null);
    const [renderedHtml, setRenderedHtml] = useState("");

    // Fetch initial settings and email template
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await postData("get-website-settings", {});
                const settings = response?.settings?.[0];

                if (settings) {
                    setFormData({
                        app_name: settings.website_name || "",
                        banner_image: settings.banner_image || "",
                        website_link: settings.website_link || "",
                        apk_link: settings.android_link || "",
                        apple_link: settings.ios_link || "",
                        base_url: settings.baseUrl || "",
                        copy_right: settings.copy_right || "",
                        email_title: settings.email_title || "",
                    });
                }
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            }
        };

        fetchSettings();

        fetch("/email_otp.html")
            .then((res) => res.text())
            .then(setTemplate)
            .catch(console.error);
    }, []);

    // Debounced preview update
    useEffect(() => {
        if (!template) return;

        const timeout = setTimeout(() => {
            let html = template;
            for (const key in formData) {
                const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
                html = html.replace(regex, formData[key]);
            }

            const finalHtml = `
                <html>
                  <head>
                    <style>
                      * { box-sizing: border-box; }
                      html, body { margin: 0; padding: 0; overflow: hidden; }
                    </style>
                  </head>
                  <body>
                    ${html}
                    <script>
                      function resizeIframe() {
                        const height = document.documentElement.scrollHeight;
                        parent.postMessage({ type: 'setHeight', height }, '*');
                      }
                      window.addEventListener('load', () => {
                        const imgs = document.images;
                        if (imgs.length === 0) return resizeIframe();
                        let loaded = 0;
                        for (let img of imgs) {
                          if (img.complete) loaded++;
                          else img.addEventListener('load', () => {
                            loaded++;
                            if (loaded === imgs.length) resizeIframe();
                          });
                        }
                        if (loaded === imgs.length) resizeIframe();
                      });
                    </script>
                  </body>
                </html>
              `;
            setRenderedHtml(finalHtml);
        }, 300);

        return () => clearTimeout(timeout);
    }, [formData, template]);

    // Iframe height auto-resize
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === "setHeight" && iframeRef.current) {
                iframeRef.current.style.height = `${event.data.height}px`;
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    // Input change handler
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Image input handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setBannerFile(file);
            setFormData((prev) => ({ ...prev, banner_image: localUrl }));
        }
    };

    // Submit handler
    const handleSubmit = async () => {
        
        const fd = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            fd.append(key, value);
        });
        fd.append("setting_id" ,1)
        fd.append("is_banner" ,true)
        if (bannerFile) {
            fd.append("files", bannerFile); // Your backend will receive as req.files[0]
        }


        try {
            const response = await postData("edit-website-setting", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.success) {
                Swal.fire({
                    icon: "success",
                    title: "Settings Updated",
                    text: "Your website settings have been successfully updated!",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }

            console.log("Update successful:", response);
        } catch (err) {
            console.error("Update failed:", err);
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Something went wrong while updating the settings.",
            });
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {/* Preview */}
            <div className="panel">
                <h2 className="text-xl font-bold mb-4">Live Preview</h2>
                <iframe
                    ref={iframeRef}
                    title="Email Preview"
                    srcDoc={renderedHtml}
                    className="w-full border rounded"
                    style={{ width: "100%", border: "1px solid #ccc", height: "100px" }}
                />
            </div>

            {/* Form */}
            <div className="panel">
                <h2 className="text-xl font-bold mb-4">Fill Template Fields</h2>

                {Object.keys(formData).map((key) =>
                    key !== "banner_image" && key !== "base_url" ? (
                        <div key={key} className="mb-4">
                            <label className="block font-medium mb-1">
                                {labels[key] || key}
                            </label>
                            <input
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="border rounded px-3 py-2 w-full"
                                placeholder={`Enter ${labels[key] || key}`}
                            />
                        </div>
                    ) : null
                )}



                <div className="mb-4">
                    <label className="block font-medium mb-1">Banner Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {formData.banner_image && (
                        <img
                            src={formData.banner_image}
                            alt="Banner Preview"
                            className="mt-2 max-h-40 rounded border"
                        />
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white rounded px-4 py-2 mt-4 hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EmailTemplatePreview;
