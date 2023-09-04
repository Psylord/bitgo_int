const ComputeAncestorsLogic = require('./logic/computeAncestorsLogic');


async function init() {
    const computeAncestorsLogic = new ComputeAncestorsLogic();
    await computeAncestorsLogic.computeAncestors(680000);
}

init();