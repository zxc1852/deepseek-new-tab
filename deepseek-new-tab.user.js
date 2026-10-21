// ==UserScript==
// @name         DeepSeek 及通用链接强制新标签页打开
// @name:zh-CN   DeepSeek 及通用链接强制新标签页打开
// @namespace    https://github.com/你的用户名/deepseek-new-tab
// @version      1.1.0
// @description  强制 DeepSeek 等 SPA 网页中的链接在新标签页打开，同时兼容普通网页（基于 X.I.U 脚本魔改）。
// @description:zh-CN  强制 DeepSeek 等 SPA 网页中的链接在新标签页打开，同时兼容普通网页（基于 X.I.U 脚本魔改）。
// @author       你的用户名
// @license      GPL-3.0
// @match        *://*/*
// @grant        none
// @run-at       document-start
//
// @original-author  X.I.U
// @original-license GPL-3.0
// @original-script  https://greasyfork.org/scripts/429714
// ==/UserScript==

/*
 * 说明：
 * 1. 本脚本基于 X.I.U 的《新标签页打开链接》（GreasyFork #429714）进行魔改，
 *    原脚本以 GPL-3.0 协议发布，本脚本同样以 GPL-3.0 发布。
 * 2. 本脚本由 DeepSeek 辅助生成核心事件拦截逻辑，已在 DeepSeek 网页版实测可用。
 */

(function() {
    'use strict';

    const isDeepSeek = /chat\.deepseek\.com/.test(window.location.hostname);

    function shouldOpenInNewTab(link) {
        if (!link || !link.href) return false;
        if (link.onclick || !link.href.startsWith('http') ||
            link.getAttribute('href')?.startsWith('#') ||
            link.getAttribute('href')?.startsWith('javascript:')) {
            return false;
        }
        return true;
    }

    function setupClickInterceptor() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link || !shouldOpenInNewTab(link)) return;

            if (isDeepSeek) {
                e.preventDefault();
                e.stopPropagation();
                window.open(link.href, '_blank', 'noopener,noreferrer');
            } else {
                if (link.target !== '_blank') {
                    link.target = '_blank';
                }
            }
        }, true);
    }

    function applyBaseTarget() {
        if (!document.querySelector('base[target]')) {
            const base = document.createElement('base');
            base.target = '_blank';
            document.head.appendChild(base);
        }
    }

    function observeDynamicLinks() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.tagName === 'A' && shouldOpenInNewTab(node) && !isDeepSeek && node.target !== '_blank') {
                        node.target = '_blank';
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('a').forEach(link => {
                            if (shouldOpenInNewTab(link) && !isDeepSeek && link.target !== '_blank') {
                                link.target = '_blank';
                            }
                        });
                    }
                }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }

    if (isDeepSeek) {
        setupClickInterceptor();
        observeDynamicLinks();
    } else {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                applyBaseTarget();
                observeDynamicLinks();
            });
        } else {
            applyBaseTarget();
            observeDynamicLinks();
        }
        setupClickInterceptor();
    }
})();
