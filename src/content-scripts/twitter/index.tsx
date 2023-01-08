import ReactDOM from "react-dom/client";
import React from "react";
import MagicallyTwitter from "./MagicallyTwitter";


const observer = new MutationObserver((mutations, _) => {

    mutations.forEach((_) => {
        const targetsWithTwitterToolbar = document.querySelectorAll(".css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t")

        if (!targetsWithTwitterToolbar || !targetsWithTwitterToolbar.length) {
            return;
        }

        targetsWithTwitterToolbar.forEach((target) => {
            const magicalRootTarget = target.querySelector(`[data-testid="toolBar"]`);

            if (!magicalRootTarget) {
                return;
            }

            const textTargets = target.getElementsByClassName("DraftEditor-editorContainer");

            if (!textTargets || !textTargets.length) {
                return;
            }

            Array.from(textTargets).forEach((textTarget) => {
                const closestTextTarget = getClosestTextTarget(textTarget)

                if (!closestTextTarget) {
                    return;
                }

                const magicalRootId = `magical-root-${getUniqueEditorId(closestTextTarget)}`;

                if (document.getElementById(magicalRootId)) {
                    return;
                }

                const tweetContext = getTweetContext(target);

                const magicalRoot = document.createElement("div");
                magicalRoot.id = magicalRootId;
                magicalRoot.style.width = "100%";
                magicalRootTarget.append(magicalRoot);

                const root = ReactDOM.createRoot(document.getElementById(magicalRootId)!)
                root.render(
                    <React.StrictMode>
                        <MagicallyTwitter target={closestTextTarget} context={tweetContext}/>
                    </React.StrictMode>
                );
            });
        });
    });
});

function getTweetContext(element: Element): string {
    const tweet = element.querySelector(`[data-testid="tweet"]`);

    if (!tweet && element.parentElement) {
        return getTweetContext(element.parentElement);
    }

    const tweetText = tweet?.querySelector(`[data-testid="tweetText"]`);

    return tweetText?.textContent || "";
}

function getClosestTextTarget(element: Element): HTMLElement | undefined {
    const target = element.querySelector(`[data-contents="true"]`)

    if (!target) {
        return;
    }

    return target as HTMLElement;
}

function getUniqueEditorId(element: Element) {
    return element.querySelector(`[data-editor]`)?.getAttribute("data-editor")
}

const body = document.getElementsByTagName("body")[0];

observer.observe(body, {attributes: false, childList: true, subtree: true})