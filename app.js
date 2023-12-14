function linkAllIdAnchors() {
    // pilfered from: https://css-tricks.com/snippets/jquery/smooth-scrolling/
    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });
}

function getHideableBlocksForButton(expanderButton) {
    var block = expanderButton.closest(".expandable").first();
    var items = block
        .children(".expandable__item")
        .filter(function (index, item) {
            return $(item).data("should-hide");
        });
    return items;
}

function getDefaultTextForExpanderButton(expanderButton, blocks) {
    blocks = blocks || getHideableBlocksForButton(expanderButton);
    return `View ${blocks.length} more projects`;
}

function initializeExpanders() {
    $(".expandable__button").each((index, button) => {
        const jButton = $(button);
        const buttonText = getDefaultTextForExpanderButton(jButton);
        jButton.text(buttonText);
    });
    $(".expandable__button")
        .click(function (event) {
            var button = $(event.target);
            var isExpanded = button.data("is-expanded");
            const items = getHideableBlocksForButton(button);
            const expandedText = "Hide open projects";
            const defaultText = getDefaultTextForExpanderButton(button, items);
            if (isExpanded) {
                button.text(defaultText);
                items.addClass("expandable__item--hidden");
                button.data("is-expanded", false);
            } else {
                button.text(expandedText);
                items.removeClass("expandable__item--hidden");
                button.data("is-expanded", true);
            }
        });
}

function growProgressBarsWhenOnScreen() {
    var os = new OnScreen();
    os.on("enter", "[data-percent]", function (element, event) {
        var bar = $(element);
        var desiredPercent = bar.data("percent");
        bar.css("width", desiredPercent);
    });
}

$(document).ready(function () {
    linkAllIdAnchors();
    initializeExpanders();
    growProgressBarsWhenOnScreen();
});