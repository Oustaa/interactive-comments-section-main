const CommentContainer = document.querySelector("#Comment__Cntainer");
const Comments = document.querySelector("#Comments");

window.onload = () => {
    loadComments();
};

const fetchComments = async() => {
    return fetch("../data.json")
        .then((resp) => resp.json())
        .then((data) => {
            localStorage.setItem("data", JSON.stringify(data));
        });
};

const addReply = (userName = "") => {
    const currentUser = JSON.parse(localStorage.getItem("data")).currentUser;

    const replyForm = document.createElement("div");
    const imgDiv = document.createElement("div");
    const textarea = document.createElement("textarea");
    const replybtn = document.createElement("button");
    const img = document.createElement("img");

    replyForm.classList.add("add__Comment");
    imgDiv.classList.add("img");

    img.setAttribute("src", currentUser.image.png);
    textarea.setAttribute("placeholder", "Add a comment...");
    textarea.value = userName !== "" ? "@" + userName + ", " : "";
    replybtn.textContent = "REPLY";

    replybtn.addEventListener("click", () => addComment(replybtn));

    imgDiv.append(img);
    replyForm.append(imgDiv, textarea, replybtn);
    return replyForm;
};

const replies = (replies, currentUser) => {
    const repliseHolder = document.createElement("div");
    repliseHolder.setAttribute("id", "replise");

    if (replies.length === 0) return repliseHolder;
    console.log(replies);
    replies
        .map((reply) => Comment(reply, currentUser))
        .forEach((element) => repliseHolder.append(element));

    return repliseHolder;
};

function loadComments() {
    fetchComments();
    const data = JSON.parse(localStorage.getItem("data"));
    if (JSON.parse(localStorage.getItem("id")) === null)
        localStorage.setItem("id", 0);
    for (let comment of data.comments) {
        CommentContainer.append(Comment(comment, data.currentUser));

        if (comment.replies.length !== 0) {
            CommentContainer.append(replies(comment.replies, data.currentUser));
        }
    }
    Comments.append(addReply());
}

function addComment(element) {
    const currentUser = JSON.parse(localStorage.getItem("data")).currentUser;

    const textArea = element.previousElementSibling;
    const content = element.previousElementSibling.value.replaceAll("\n", "<br>");
    if (content.length <= 120) return;
    const comment = {
        content,
        createdAt: "now",
        id: 515,
        score: 0,
        user: currentUser,
    };
    const newELement = Comment(comment, currentUser);
    const parentElement = element.parentNode;
    parentElement.parentNode.insertBefore(newELement, parentElement);

    // removing reply Area after adiing a comment

    const addComment = document.querySelectorAll(".add__Comment");
    const index = Array(...addComment).indexOf(element.parentNode);
    console.log(index, Array(...addComment).length);
    if (
        Array(...addComment).length === 1 ||
        index === Array(...addComment).length - 1
    ) {
        element.previousElementSibling.value = "";
        return;
    }
    element.parentNode.parentNode.removeChild(element.parentNode);
}

const replyToComment = (element) => {
    const replyTo = element.parentNode.childNodes[0].childNodes[1].textContent;
    const nextSibling = element.parentNode.nextSibling;

    // clearing All replys from the Dom
    const addComment = document.querySelectorAll(".add__Comment");
    console.log(...addComment);
    if (addComment.length < 1)
        addComment[0].parentNode.removeChild(addComment[0]);

    if (nextSibling.id === "replise") {
        element.parentNode.nextSibling.append(addReply(replyTo));
    } else if (element.parentNode.parentNode.id === "replise") {
        element.parentNode.parentNode.append(addReply(replyTo));
    } else {
        element.parentNode.parentNode.insertBefore(
            replies([], ""),
            element.parentNode.nextSibling
        );
        replyToComment(element);
    }
};

const Comment = (comment, CurrentUser) => {
    const { content, createdAt, score, user } = comment;
    const id = JSON.parse(localStorage.getItem("id"));
    localStorage.setItem("id", id + 1);
    //creating Element
    const CommentHolder = document.createElement("div");
    const Commentheader = document.createElement("div");
    const CommentBody = document.createElement("div");
    const CommentReactions = document.createElement("div");
    const E_D_Btns = document.createElement("div");

    const CommentImage = document.createElement("img");
    const userName = document.createElement("h3");
    const creatAt = document.createElement("p");
    const CommentContent = document.createElement("p");

    const btnPlus = document.createElement("button");
    const btnMinus = document.createElement("button");
    const SpanScore = document.createElement("span");

    const btnReply = document.createElement("button");

    const YouBadge = document.createElement("span");

    const btnDelete = document.createElement("button");
    const btnEdit = document.createElement("button");

    //setting Classes
    CommentHolder.classList.add("Comment");
    Commentheader.classList.add("Comment__Header");
    CommentReactions.classList.add("Comment__Reactions");
    CommentBody.classList.add("Comment__Body");
    btnReply.classList.add("Comment__reply");
    YouBadge.classList.add("YouBadg");
    E_D_Btns.classList.add("E_D_Btns");

    CommentHolder.setAttribute("data-id", id);

    btnDelete.addEventListener("click", () => deleteComment(id));

    //setting content
    CommentImage.setAttribute("src", user.image.png);
    userName.textContent = user.username;
    creatAt.textContent = createdAt;
    CommentContent.innerHTML = content;
    YouBadge.textContent = "You";

    btnPlus.innerHTML = "<img src='./images/icon-plus.svg' >";
    btnMinus.innerHTML = "<img src='./images/icon-minus.svg' >";
    SpanScore.innerHTML = score;

    btnReply.innerHTML =
        "<img src='./images/icon-reply.svg' > <span>Reply</span>";

    btnDelete.innerHTML = `<img src="./images/icon-delete.svg" alt=""> <span>Delete</span>`;
    btnEdit.innerHTML = `<img src="./images/icon-edit.svg" alt=""><span>Edit</span>`;

    // join EveryThing together
    E_D_Btns.append(btnDelete, btnEdit);
    btnReply.addEventListener("click", () => replyToComment(btnReply));
    const headerConntent =
        CurrentUser.username !== user.username ?
        [CommentImage, userName, creatAt] :
        [CommentImage, userName, YouBadge, creatAt];
    const ActionBtns =
        CurrentUser.username !== user.username ? btnReply : E_D_Btns;
    Commentheader.append(...headerConntent);
    CommentBody.append(CommentContent);
    CommentReactions.append(btnPlus, SpanScore, btnMinus);
    CommentHolder.append(
        Commentheader,
        CommentBody,
        CommentReactions,
        ActionBtns
    );

    return CommentHolder;
};

const deleteComment = (id) => {
    document.body.style.overflowY = "hidden";

    const Comfermdelete = document.querySelector("#Comfermdelete");
    const backDrop = document.querySelector("#backdrop");
    Comfermdelete.classList.add("animate");
    backDrop.classList.add("animatebAckDrop");
    const deleteBtn = document.querySelector("#Deletebtn");
    deleteBtn.addEventListener("click", () => {
        const commentTodelet = document.querySelector(`[data-id='${id}']`);
        commentTodelet.parentNode.removeChild(commentTodelet);
        closeComfermWindow();
    });
    const cancelBtn = document.querySelector("#cancelBtn");

    cancelBtn.addEventListener("click", () => {
        closeComfermWindow();
    });
};

const closeComfermWindow = () => {
    const Comfermdelete = document.querySelector("#Comfermdelete");
    const backDrop = document.querySelector("#backdrop");
    console.log(Comfermdelete);
    Comfermdelete.classList.remove("animate");
    backDrop.classList.remove("animatebAckDrop");
    document.body.style.overflowY = "auto";
};