$(function () {
    function initOtpInput(containerId, onComplete) {
        const $container = $(`#${containerId}`);
        const $inputs = $container.find('input');

        let isError = false;

        // Hàm set error
        function setError(message) {
            isError = true;
            $container.addClass("isError");
            $container.find(".otp-error-message").text(message);
            // Focus vào ô cuối cùng
            $inputs.last().removeAttr("readonly disabled").focus();
        }

        // Hàm clear error
        function clearError() {
            isError = false;
            $container.removeClass("isError");
            $container.find(".otp-error-message").text("");
        }

        // Sự kiện click → focus vào ô trống đầu tiên (nếu chưa nhập hết)
        $inputs.on('focus', function (e) {
            const firstEmpty = $inputs.filter(function () {
                return !$(this).val();
            }).first();

            // Nếu còn ô trống thì chỉ cho focus vào ô trống đầu tiên
            if (firstEmpty.length) {
                if (this !== firstEmpty[0]) {
                    e.preventDefault();
                    firstEmpty.focus();
                }
            }
        });

        // Xử lý nhập
        $inputs.on("input", function () {
            const index = $inputs.index(this);
            let val = $(this).val().replace(/[^0-9]/g, ""); // chỉ cho số
            $(this).val(val);

            if (val.length === 1) {
                $(this).attr("readonly", true).attr("disabled", true);

                if (index < $inputs.length - 1) {
                    // Next sang ô tiếp theo
                    $inputs.eq(index + 1).removeAttr("readonly disabled").focus();
                } else {
                    $(this).blur();
                    const otpValue = $inputs.map(function () {
                        return $(this).val();
                    }).get().join("");
                    onComplete && onComplete(otpValue, setError, clearError);
                }
            }
        });

        // Xử lý backspace
        $inputs.on("keydown", function (e) {
            const index = $inputs.index(this);

            if (e.key === "Backspace" && !$(this).val()) {
                if (index > 0) {
                    $inputs.eq(index - 1).removeAttr("readonly disabled").val("").focus();
                }
            } else if ($(this).val()) {
                clearError();
            }
        });
    }

    initOtpInput("otp-input-container", function (otp, setError, clearError) {
        console.log("OTP nhập:", otp);

        setTimeout(() => {
            // Ví dụ check
            if (otp !== "1234") {
                setError("OTP không hợp lệ!");
            } else {
                clearError();
                alert("OTP hợp lệ!");
            }
        }, 1000)
    });

    $('input[type="text"]').each(function () {
        const $input = $(this);
        const $clearBtn = $input.siblings('.clear-btn');


        if ($clearBtn != null) {
            $input.on('input', function () {
                if ($(this).val().trim().length > 0) {
                    $clearBtn.fadeIn(150);
                } else {
                    $clearBtn.fadeOut(150);
                }
            });

            // Xoá khi click nút X
            $clearBtn.on('click', function () {
                $input.val('').trigger('input').focus();
            });
        }
    });

    $('.toggle-pass').on('click', function () {
        const $wrapper = $(this).closest('.input-wrapper');
        const $input = $wrapper.find('input');
        const $eye = $(this).find('.fa-eye');
        const $eyeSlash = $(this).find('.fa-eye-slash');

        if ($input.attr('type') === 'password') {
            $input.attr('type', 'text');
            $eye.hide();
            $eyeSlash.show();
        } else {
            $input.attr('type', 'password');
            $eye.show();
            $eyeSlash.hide();
        }
    });
});
