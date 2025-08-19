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
            if (otp !== "123456") {
                setError("OTP không hợp lệ!");
            } else {
                clearError();
                alert("OTP hợp lệ!");
            }
        }, 1000)
    });

    $('input:not([type="password"])').each(function () {
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

    $("#btnToggleMenuMobile").click(() => {
        $(".goPlay-header-mobile").toggle();
    })

    $(document).on('click', function (e) {
        const $target = $(e.target);
        if (!$target.closest('.goPlay-header').length) {
            $(".goPlay-header-mobile").hide();
        }
    });

    class OwlAsNavFor {
        constructor(mainSelector, thumbSelector, mainOptions = {}, thumbOptions = {}) {
            this.$main = $(mainSelector);
            this.$thumb = $(thumbSelector);

            this.mainOptions = Object.assign({
                items: 1,
                nav: false,
                dots: false,
                loop: false
            }, mainOptions);

            this.thumbOptions = Object.assign({
                items: 4,
                margin: 10,
                dots: false,
                nav: false,
                center: false,
                loop: false
            }, thumbOptions);

            this.init();
        }

        init() {
            const _this = this;

            // Init main
            this.$main.owlCarousel(this.mainOptions)
                .on("changed.owl.carousel", function (e) {
                    let index = e.item.index;
                    _this.syncThumb(index);
                });

            // Init thumb
            this.$thumb.owlCarousel(this.thumbOptions)
                .on("click", ".owl-item", function () {
                    let index = $(this).index();
                    _this.$main.trigger("to.owl.carousel", [index, 300, true]);
                });

            // Set trạng thái ban đầu
            this.$thumb.find(".owl-item").eq(0).addClass("current");
        }

        syncThumb(index) {
            this.$thumb.trigger("to.owl.carousel", [index, 300, true]);
            this.$thumb.find(".owl-item").removeClass("current").eq(index).addClass("current");
        }
    }

    new OwlAsNavFor("#mainSlider", "#thumbSlider",
        {
            autoplay: true,
            autoplayTimeout: 6000,
            autoplayHoverPause: false,
        },
        {
            items: 2,
            responsive: {
                768: {
                    items: 4
                }
            },
            autoplay: true,
            autoplayTimeout: 6000,
            autoplayHoverPause: false,
        }
    );
});
