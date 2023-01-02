import React from "react";
import ReactDOM from "react-dom/client";
import MagicallyOutlook from "./MagicallyOutlook";

const magicalRoots = new Set<string>();

const observer = new MutationObserver((mutations, _) => {

    mutations.forEach((m) => {
        const targets = Array.from(m.addedNodes)
            .filter(n => n instanceof Element)
            .map(n => n as Element)
            .find(e => e.querySelector("[id*='docking']"))

        if (!targets) {
            return;
        }

        const magicalRootTarget = targets.querySelector("[id*='DockingTriggerPart']");

        if (!magicalRootTarget || !magicalRootTarget.nextElementSibling) {
            return;
        }

        const textTarget = targets.querySelector("[id*='editorParent']")

        if (!textTarget || !textTarget.firstElementChild) {
            return;
        }

        const magicalRootId = `magical-root-${magicalRootTarget.id}-${textTarget.id}`;

        if (magicalRoots.has(magicalRootId)) {
            const hasMagicalRoot = magicalRootTarget.querySelector(`[id*=magicalRootId]`);
            if (hasMagicalRoot) {
                return;
            }
        }

        const magicalRoot = document.createElement("div");
        magicalRoot.id = magicalRootId;
        magicalRootTarget.nextElementSibling.prepend(magicalRoot);
        magicalRoots.add(magicalRootId);

        if (!textTarget.firstElementChild.textContent) {
            textTarget.firstElementChild.textContent = "Write an email ";
        }

        const root = ReactDOM.createRoot(document.getElementById(magicalRootId)!)
        root.render(
            <React.StrictMode>
                <MagicallyOutlook target={textTarget.firstElementChild}/>
            </React.StrictMode>
        )
    });
})

const body = document.getElementsByTagName("body")[0];

observer.observe(body, {attributes: false, childList: true, subtree: true})

