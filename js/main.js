const CommentContainer = document.querySelector("#Comment__Cntainer");
const Comments = document.querySelector("#Comments");

window.onload = () => {
    loadComments();
};

const fetchComments = () => {
    fetch("../data.json")
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

const loadComments = () => {
    fetchComments();
    const data = JSON.parse(localStorage.getItem("data"));

    for (let comment of data.comments) {
        CommentContainer.append(Comment(comment, data.currentUser));

        if (comment.replies.length !== 0) {
            CommentContainer.append(replies(comment.replies, data.currentUser));
        }
    }
    Comments.append(addReply());
};

const addComment = (element) => {
    const currentUser = JSON.parse(localStorage.getItem("data")).currentUser;

    const content = element.previousElementSibling.value.replaceAll("\n", "<br>");
    if (content.length <= 20) return;
    const comment = {
        content,
        createdAt: "now",
        score: 0,
        user: currentUser,
        id: 51,
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
};

const replyToComment = (element) => {
    const replyTo = element.parentNode.childNodes[0].childNodes[1].textContent;
    const nextSibling = element.parentNode.nextSibling;

    // clearing All replys from the Dom
    const addComment = document.querySelectorAll(".add__Comment");
    console.log(addComment.length);
    if (addComment.length > 1) {
        addComment[0].parentNode.removeChild(addComment[0]);
    }

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
    const { content, id, createdAt, score, user } = comment;

    // const id = JSON.parse(localStorage.getItem("id"));
    // localStorage.setItem("id", id + 1);

    //creating Element
    const CommentHolder = document.createElement("div");
    const Commentheader = document.createElement("div");
    const CommentBody = document.createElement("div");
    const CommentReactions = document.createElement("div");
    const E_D_Btns = document.createElement("div");

    const editForm = document.createElement("div");
    const textAreaComment = document.createElement("textarea");
    const comfermEdit = document.createElement("button");

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
    editForm.classList.add("Hide", "editForm");
    CommentHolder.setAttribute("data-id", id);

    // Add Events To btns
    btnDelete.addEventListener("click", () => deleteComment(id));
    btnReply.addEventListener("click", () => replyToComment(btnReply));

    btnMinus.addEventListener("click", () => decreaseScore(btnMinus));
    btnPlus.addEventListener("click", () => increaseScore(btnPlus));
    textAreaComment.addEventListener("input", function(e) {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
    btnEdit.addEventListener("click", () => {
        editForm.classList.remove("Hide");
        CommentContent.classList.add("Hide");
        textAreaComment.focus();
    });
    comfermEdit.addEventListener("click", () => {
        const newContent = textAreaComment.textContent;
        CommentContent.textContent = newContent;
        editForm.classList.add("Hide");
        CommentContent.classList.remove("Hide");
        console.log(CommentContent);
    });
    //setting content
    CommentImage.setAttribute("src", user.image.png);
    userName.textContent = user.username;
    creatAt.textContent = createdAt;
    CommentContent.innerHTML = content;
    YouBadge.textContent = "You";
    textAreaComment.textContent = content;
    btnPlus.innerHTML = "<img src='./images/icon-plus.svg' >";
    btnMinus.innerHTML = "<img src='./images/icon-minus.svg' >";
    SpanScore.innerHTML = score;
    comfermEdit.textContent = "UPDATE";

    btnReply.innerHTML =
        "<img src='./images/icon-reply.svg' > <span>Reply</span>";

    btnDelete.innerHTML = `<img src="./images/icon-delete.svg" alt=""> <span>Delete</span>`;
    btnEdit.innerHTML = `<img src="./images/icon-edit.svg" alt=""><span>Edit</span>`;

    // join EveryThing together
    E_D_Btns.append(btnDelete, btnEdit);
    const userTest = CurrentUser.username !== user.username;
    const headerConntent = userTest ?
        [CommentImage, userName, creatAt] :
        [CommentImage, userName, YouBadge, creatAt];
    const ActionBtns = userTest ? btnReply : E_D_Btns;
    editForm.append(textAreaComment, comfermEdit);
    const bodyContent = userTest ? [CommentContent] : [CommentContent, editForm];

    Commentheader.append(...headerConntent);
    CommentBody.append(...bodyContent);
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

    cancelBtn.addEventListener("click", () => closeComfermWindow());
};

const closeComfermWindow = () => {
    const Comfermdelete = document.querySelector("#Comfermdelete");
    const backDrop = document.querySelector("#backdrop");
    console.log(Comfermdelete);
    Comfermdelete.classList.remove("animate");
    backDrop.classList.remove("animatebAckDrop");
    document.body.style.overflowY = "auto";
};

const decreaseScore = (element) => {
    scoreElement = element.previousElementSibling;
    scoreValue = scoreElement.textContent;
    if (scoreValue == 0) return;
    scoreElement.textContent = Number(scoreValue) - 1;
};

const increaseScore = (element) => {
    const scoreElement = element.nextSibling;
    const scoreValue = scoreElement.textContent;
    scoreElement.textContent = Number(scoreValue) + 1;
};

const textarea = document.getElementById("txt");

// textarea.addEventListener("input", function(e) {
//     this.style.height = "auto";
//     this.style.height = this.scrollHeight + "px";
// });

const createElement = (type, classes, content = null) => {
    const element = document.createElement(type);
    element.classList.add(...classes);
    return element;
};