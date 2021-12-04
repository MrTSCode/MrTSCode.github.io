function getDuration(thisO) {
    let duration = parseFloat(thisO.replace('s', '')) * 1000;
    return duration;
};