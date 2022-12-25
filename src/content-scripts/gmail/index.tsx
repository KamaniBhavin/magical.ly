import React from "react";
import ReactDOM from "react-dom/client";
import Magically from "../../components/Magically";

function getClosestTextTarget(element: Element, className: string): Element | undefined {
    const targets = Array.from(element.children).map((c) => {
        if (c.classList.contains(className)) {
            return c;
        }
        return getClosestTextTarget(c, className)
    }).filter((t) => t)

    if (!targets || !targets.length) {
        return;
    }

    return targets[0];
}

const observer = new MutationObserver((mutations, _) => {
    console.log("mutation")
    mutations.forEach((_) => {
        const magicRootTargets = document.getElementsByClassName("HE");

        if (!magicRootTargets || !magicRootTargets.length) {
            return;
        }

        Array.from(magicRootTargets).forEach((target) => {

            if (!target.parentElement || !target.parentElement.previousElementSibling) {
                return;
            }

            const textTarget = getClosestTextTarget(target.parentElement.previousElementSibling, "editable")

            if (!textTarget) {
                return;
            }

            const magicalRootId = `magical-root-${target.id}-${textTarget.id}`;

            if (Array.from(target.children).some((n) => n.id == magicalRootId)) {
                return;
            }

            const magicalRoot = document.createElement("div");
            magicalRoot.id = magicalRootId;
            target.prepend(magicalRoot);

            textTarget.textContent = "Write an email "

            const root = ReactDOM.createRoot(document.getElementById(magicalRootId)!)
            root.render(
                <React.StrictMode>
                    <Magically target={textTarget} />
                </React.StrictMode>
            )
        })
    })
})

const body = document.getElementsByTagName("body")[0];

observer.observe(body, { attributes: false, childList: true, subtree: false })

