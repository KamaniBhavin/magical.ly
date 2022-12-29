import ReactDOM from "react-dom/client";
import React from "react";
import MagicallyTwitter from "./MagicallyTwitter";


const magicalRoots = new Set<string>();

const observer = new MutationObserver((mutations, _) => {

    mutations.forEach((m) => {
        const targetWithTwitterToolbar = Array.from(m.addedNodes)
            .filter(n => n instanceof Element)
            .map(n => n as Element)
            .find(e => e.querySelector(`[data-testid="toolBar"]`));

        if (!targetWithTwitterToolbar) {
            return;
        }

        const magicalRootTarget = targetWithTwitterToolbar.querySelector(`[data-testid="toolBar"]`)

        if (!magicalRootTarget) {
            return;
        }

        const textTargets = document.getElementsByClassName("DraftEditor-editorContainer");

        if (!textTargets || !textTargets.length) {
            return;
        }

        Array.from(textTargets).forEach((textTarget) => {

            const closestTextTarget = getClosestTextTarget(textTarget)

            if (!closestTextTarget) {
                console.log("No closest target!")
                return;
            }

            const magicalRootId = `magical-root-${getUniqueEditorId(closestTextTarget)}`

            if (magicalRoots.has(magicalRootId)) {
                console.info("Already has a root!")
                return;
            }
            magicalRoots.add(magicalRootId);

            const tweetContext = getTweetContext(targetWithTwitterToolbar);

            const magicalRoot = document.createElement("div");
            magicalRoot.id = magicalRootId;
            magicalRoot.style.width = "100%";
            magicalRootTarget.append(magicalRoot);

            const root = ReactDOM.createRoot(document.getElementById(magicalRootId)!)
            root.render(
                <React.StrictMode>
                    <MagicallyTwitter target={closestTextTarget} context={tweetContext}/>
                </React.StrictMode>
            )
        })
    })
});

function getTweetContext(element: Element) {
    const tweet = element.querySelector(`[data-testid="tweet"]`)
    const tweetText = element.querySelector(`[data-testid="tweetText"]`)

    if (!tweet || !tweetText) {
        return "";
    }

    return tweetText.textContent || "";
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

console.log(body)

observer.observe(body, {attributes: false, childList: true, subtree: true})