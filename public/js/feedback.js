// show feedback to user
const showFeedback = (status, code, element) => {
    // remove old status classes
    const statusClasses = ['userErr', 'serverErr', 'ok'];
    statusClasses.forEach(statusClass => {
        element.classList.remove(statusClass);
    });

    // insert status text to feedback element
    element.innerText = status;

    // add status code & show element
    element.classList.add(code);
    element.classList.remove('hidden');

    // if statuscode is 'ok', refresh the page
    if (code === 'ok') {
        window.location.reload();
    };
}