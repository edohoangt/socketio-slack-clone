const username = prompt("What is your username?");

const socket = io("http://localhost:9000");

let nsSocket = "";

socket.on("nsList", (nsData) => {
  let namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";

  // populate namespace lists on UI
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`;
  });

  // add click listener to each namespace img
  Array.from(document.getElementsByClassName("namespace")).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const nsEndpoint = elem.getAttribute("ns");
      joinNs(nsEndpoint);
    });
  });

  // join default ns
  joinNs("/wiki", {
    query: {
      username,
    },
  });
});
