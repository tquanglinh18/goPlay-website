(function () {
    let timeoutCurr = 0;

    window.showToastNotify = async function (type, title, message, options = {}) {
        const root = document.getElementById("goPlay-toast");
        const titleElm = document.getElementById("toast-title");
        const closeBtnElm = document.getElementById("closeBtn");
        const messageElm = document.getElementById("toast-message");
        const btnConfirmElm = document.getElementById("btnConfirm");
        const btnCancelElm = document.getElementById("btnCancel");

        // Clear timeout + ẩn toast cũ
        if (timeoutCurr) {
            clearTimeout(timeoutCurr);
            timeoutCurr = 0;
            await hideToastNotify();
        }

        // Reset class cũ
        root.classList.remove("toast-error", "toast-warning", "anchor-top", "anchor-bottom");

        // Nội dung
        titleElm.textContent = title || "Thông báo";
        messageElm.textContent = message || "";

        // Nút X
        closeBtnElm.textContent = "×";
        closeBtnElm.onclick = () => hideToastNotify();

        // Type
        if (type === "error") root.classList.add("toast-error");
        if (type === "warning") root.classList.add("toast-warning");

        // Anchor
        root.classList.add(options.anchor === "top" ? "anchor-top" : "anchor-bottom");

        // Nút Confirm
        btnConfirmElm.textContent = options.titleConfirm || "Xác nhận";
        btnConfirmElm.onclick = () => {
            if (typeof options.onConfirm === "function") options.onConfirm();
            hideToastNotify();
        };

        // Nút Cancel
        if (options.showCancel) {
            btnCancelElm.style.display = "";
            btnCancelElm.textContent = options.titleCancel || "Huỷ bỏ";
            btnCancelElm.onclick = () => {
                if (typeof options.onCancel === "function") options.onCancel();
                hideToastNotify();
            };
        } else {
            btnCancelElm.style.display = "none";
        }

        // Show toast
        root.classList.remove("toast-hide");
        root.classList.add("toast-show");

        // Auto hide
        timeoutCurr = setTimeout(() => hideToastNotify(), options.time > 0 ? options.time : 3000);
    };

    window.hideToastNotify = function () {
        return new Promise(resolve => {
            const root = document.getElementById("goPlay-toast");
            root.classList.remove("toast-show");
            root.classList.add("toast-hide");

            setTimeout(() => {
                root.classList.remove("anchor-top", "anchor-bottom", "toast-warning", "toast-error");
                resolve();
            }, 300);
        });
    };
})();
