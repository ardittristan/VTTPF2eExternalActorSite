import nodestoFont from '../fonts/NodestoCapsCondensed.otf'
import pathfinder2eActionsFont from '../fonts/Pathfinder2eActions.ttf'

/**
 * example of loading in local font without webpack breaking the link
 */

Hooks.on("start", () => {
    $('style.nodestoFont')[0].innerHTML = `@font-face {
        font-family: "Nodesto";
        src: url("${nodestoFont}");
    }`
    $('style.pathfinder2eActionsFont')[0].innerHTML = `@font-face {
        font-family: "Pathfinder2eActions";
        src: url("${pathfinder2eActionsFont}");
    }`
})
