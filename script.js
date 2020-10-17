
var _panes = document.getElementById('panes');
var _sidebar = document.getElementById('subsections')
var _navbar = document.getElementById('navlist')
var currentPane = 0;
var currentColumn = 0;
// start process
msg_colHeight = 75;
msg_colWidth = 75;

//handles the changes to the transform style of elements
PaneTransition = function(){
    //Transitions to correct msg-container
    _panes.style.transform = "translate(" + (- currentPane*msg_colWidth) + "vw," + (-currentColumn*msg_colHeight) + "vh)";

    //Transitions to correct sidebar
    _sidebar.style.transform = "translateY(" + (-100 * currentPane) + "vh)";

    //shift elements in sidebar
    for (var i = 0; i < _sidebar.children[currentPane].firstElementChild.children.length; i++){
        var el = _sidebar.children[currentPane].firstElementChild.children[i];
        if (i < currentColumn) {
            el.style.transform = "translateY(-25vh)";
            el.style.color = "#ddd";
        }
        if (i == currentColumn){
            el.style.transform = "translateY(0vh)";
            el.style.color = "#fff";
        }
        if (i > currentColumn) {
            el.style.transform = "translateY(25vh)";
            el.style.color = "#ddd";
        }
    }

    //shift elements in navbar
    for (var i = 0; i < _navbar.children.length; i++){
        var el = _navbar.children[i];
        if (i < currentPane - 1) {
            el.style.transform = "translate(20vw,-50%)";
            el.style.color = "#ddd";
        }
        if (i == currentPane - 1){
            el.style.transform = "translate(40vw)";
            el.style.color = "#fff";
        }
        if (i > currentPane - 1) {
            el.style.transform = "translate(65vw,-50%)";
            el.style.color = "#ddd";
        }
    }
}

//assigns correct functions to li's in the sidebar
assignSidebarOnClick = function(row) {
    return function(){
        currentColumn = row;
        PaneTransition();
    }
}

//loops through each sidebar element and assigns the correct functions
for( var i = 0 ; i < _sidebar.children.length ; i++ )
{
    for (var j = 0; j < _sidebar.children[i].firstElementChild.children.length; j++)
    {
        _sidebar.children[i].firstElementChild.children[j].onclick = assignSidebarOnClick(j);
    }
}

//assigns correct functions to li's in the navbar
assignNavbarButton = function(col){
    return function(){
        document.body.style.backgroundImage = "url('Images/background_" + col + ".jpg')";
        currentPane = col;

        currentColumn = 0;
        PaneTransition();
    }
}

//loops through each navbar element and assigns the correct functions
for( var i = 0 ; i < _navbar.children.length ; i++ )
{
    _navbar.children[i].onclick = assignNavbarButton(i+1);
}

//assigns the logo functionality
var logo = document.getElementById('logo');
logo.onclick = function(){
    document.body.style.backgroundImage = "url('Images/background_0.jpg')";
    currentColumn = 0;
    currentPane = 0;
    PaneTransition();
}

PaneTransition();