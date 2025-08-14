$(function () {
$('input[type="text"]').each(function () {
        const $input = $(this);
        const $clearBtn = $input.siblings('.clear-btn');


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
    });

    $clearBtn.on('click', function () {
        $input.val('').trigger('input').focus();
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
