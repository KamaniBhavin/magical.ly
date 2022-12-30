import React from "react";
import ReactDOM from "react-dom/client";
import MagicallyGmail from "./MagicallyGmail";

const magicalRoots = new Set<string>();

const observer = new MutationObserver((mutations, _) => {

    mutations.forEach((m) => {

        const target = Array.from(m.addedNodes)
            .filter(n => n instanceof Element)
            .map(n => n as Element)
            .filter(e => e.querySelector(".HE"))
            .find((e) => e.querySelector(".HE"))


        if (!target) {
            return;
        }

        const magicRootTarget = target.querySelector(".btC")

        if (!magicRootTarget) {
            return;
        }

        const textTarget = target.querySelector(".editable")

        if (!textTarget) {
            return;
        }

        const magicalRootId = `magical-root-${magicRootTarget.id}-${textTarget.id}`;

        if (magicalRoots.has(magicalRootId)) {
            return;
        }

        const magicalRoot = document.createElement("div");
        magicalRoot.id = magicalRootId;
        magicRootTarget.prepend(magicalRoot);
        magicalRoots.add(magicalRootId);

        textTarget.textContent = "Write an email "

        const root = ReactDOM.createRoot(document.getElementById(magicalRootId)!)
        root.render(
            <React.StrictMode>
                <MagicallyGmail target={textTarget}/>
            </React.StrictMode>
        )
    })
})

const body = document.getElementsByTagName("body")[0];

observer.observe(body, {attributes: false, childList: true, subtree: true})

