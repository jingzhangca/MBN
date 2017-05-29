//
// Loads the appropriate files when user touches a tab option. Add common prep code here.
//
function Load(opt) {
    console.log(window.location);

    if (opt == "feed") {
        window.location = window.location.origin + "/feed.html";
    }

    if (opt == "topics") {
        window.location = window.location.origin + "/topics.html";
    }

    if (opt == "tools") {
        window.location = window.location.origin + "/tools/index.html";
    }

    if (opt == "forum") {
        window.location = window.location.origin + "/forum.html";
    }

    if (opt == "more") {
        window.location = window.location.origin + "/more/index.html";
    }

    if (opt == "menu-bf") {
        window.location = window.location.origin + "/menu-bf.html";
    }

    if (opt == "menu-for-parents") {
        window.location = window.location.origin + "/content/parents.html";
    }

    if (opt == "menu-recipes") {
        window.location = window.location.origin + "/menu-recipes.html";
    }

    if (opt == "bf-1") {
        window.location = window.location.origin + "/content/content.html";
    }

    if (opt == "r6.1.1") {
        window.location = window.location.origin + "/content/recipe.html";
    }
}