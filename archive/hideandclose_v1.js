// eslint-disable-next-line no-unused-vars
function startMarketplaceAutomator() {
    if (!location.href.startsWith('https://facebook.com')) {
        alert(
            'This bookmarklet only works on Facebook Marketplace item pages.'
        );
        return;
    }

    function getNavigationAction() {
        return history.length > 1 ? 'back' : 'close';
    }

    const exitAction = getNavigationAction();

    function clickElementByAriaLabel(labelName) {
        const targetElement = document.querySelector(
            `[aria-label="${labelName}"]`
        );
        if (targetElement) targetElement.click();
        return !!targetElement;
    }

    function clickMenuOptionByText(targetText) {
        const interactiveElements = document.querySelectorAll(
            'div[role="menuitem"], div[role="button"], span'
        );
        const matchedElement = [...interactiveElements].find(
            (element) =>
                element.innerText &&
                element.innerText.trim().toLowerCase() ===
                    targetText.toLowerCase()
        );
        if (matchedElement) matchedElement.click();
        return !!matchedElement;
    }

    if (!clickElementByAriaLabel('More Item Options')) {
        alert('More Item Options button not found.');
        return;
    }

    setTimeout(() => {
        if (!clickMenuOptionByText('Hide listing')) {
            alert('Hide listing not found after opening menu.');
            return;
        }

        setTimeout(() => {
            exitAction === 'close' ? window.close() : history.back();
        }, 300);
    }, 300);
}
