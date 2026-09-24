(function () {
  "use strict";

  const language = document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  const messages = {
    en: {
      sending: "Sending...",
      sent: "Enquiry submitted",
      success: "Your enquiry was accepted by our form service. You can also contact us on WhatsApp below; please mention that you have already submitted the form.",
      rejected: "The form service did not accept this submission. Your details are still here. You can retry using the secure form, which may ask for a verification check, or contact us on WhatsApp.",
      uncertain: "We could not confirm whether your enquiry was received. Please contact us on WhatsApp before submitting again to avoid a duplicate. Your details are still here.",
      fallback: "Continue with secure form"
    },
    zh: {
      sending: "正在提交...",
      sent: "咨询已提交",
      success: "表单服务已接收您的咨询。您也可以通过下方 WhatsApp 联系我们，并说明您已填写网站表单。",
      rejected: "表单服务未接受此次提交，您填写的内容仍保留在这里。您可以通过安全表单重试，按提示完成验证，或使用 WhatsApp 联系我们。",
      uncertain: "暂时无法确认咨询是否已收到。为避免重复提交，请先通过 WhatsApp 联系我们。您填写的内容仍保留在这里。",
      fallback: "继续通过安全表单提交"
    }
  }[language];

  // These local hooks do not load analytics, store identifiers or send field values.
  function signal(name, placement) {
    document.dispatchEvent(new CustomEvent("gom:contact", {
      detail: Object.freeze({ name, language, placement })
    }));
  }

  document.querySelectorAll("[data-whatsapp-contact]").forEach(function (link) {
    link.addEventListener("click", function () {
      signal("whatsapp_click", link.closest(".info") ? "home_contact" : "support_contact");
    });
  });

  if (!window.fetch || !window.FormData || !window.AbortController) return;

  // Enable only after a real provider acceptance and inbox-delivery check.
  document.querySelectorAll('form[data-enquiry-form="enhanced"]').forEach(function (form) {
    const button = form.querySelector(".info-btn");
    const status = form.querySelector("[data-enquiry-status]");
    const fallback = form.querySelector("[data-enquiry-native]");
    if (!button || !status || !fallback || form.action !== "https://formspree.io/f/xknavdvn") return;

    const originalLabel = button.textContent;
    let state = "idle";
    let requestController;
    let timer;
    let requestVersion = 0;
    fallback.textContent = messages.fallback;

    function feedback(message, kind) {
      status.textContent = message;
      status.dataset.state = kind;
    }

    form.addEventListener("submit", async function (event) {
      if (state === "sending" || state === "success") {
        event.preventDefault();
        return;
      }
      // Keep the provider's native flow available for CAPTCHA or AJAX restrictions.
      if (event.submitter === fallback) return;
      event.preventDefault();
      if (!form.reportValidity()) return;

      state = "sending";
      const version = ++requestVersion;
      requestController = new AbortController();
      button.disabled = true;
      button.textContent = messages.sending;
      fallback.hidden = true;
      form.setAttribute("aria-busy", "true");
      feedback(messages.sending, "pending");
      timer = window.setTimeout(function () { requestController.abort(); }, 20000);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
          signal: requestController.signal,
          credentials: "omit"
        });
        const result = await response.json().catch(function () { return null; });
        if (version !== requestVersion) return;
        if (response.ok && result && result.ok === true) {
          state = "success";
          button.textContent = messages.sent;
          feedback(messages.success, "success");
          signal("enquiry_submit_success", "home_contact");
        } else {
          state = "error";
          const rejected = [400, 401, 403, 404, 422, 429].includes(response.status);
          feedback(rejected ? messages.rejected : messages.uncertain, "error");
          fallback.hidden = false;
        }
      } catch (_) {
        if (version !== requestVersion) return;
        state = "error";
        feedback(messages.uncertain, "error");
        fallback.hidden = false;
      } finally {
        window.clearTimeout(timer);
        if (version === requestVersion) {
          form.removeAttribute("aria-busy");
          if (state !== "success") {
            button.disabled = false;
            button.textContent = originalLabel;
          }
        }
      }
    });

    window.addEventListener("pagehide", function () {
      if (state !== "sending") return;
      requestVersion += 1;
      requestController.abort();
      window.clearTimeout(timer);
      state = "error";
      form.removeAttribute("aria-busy");
      button.disabled = false;
      button.textContent = originalLabel;
      feedback(messages.uncertain, "error");
      fallback.hidden = false;
    });
  });
}());
