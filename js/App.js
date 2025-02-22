//Your IPFS api key in ifura.io
const projectId = "28LuNAotbXzcvtpOcE9F8ayKOeP";
//Your api secret in ifura.io
const projectSecret = "3de3d9c099c6c0c168e39b8bc03e2f7a";

// Add this at the top with your other constants
const ADMIN_ADDRESS = "0xbe7f6bBE7f0B5A93CdB4BD8E557896cE2ae695F1";

window.CONTRACT = {
  address: "0xF3757C05279fF329C3a04FD168b484708466c13f",
  network: "Sepolia Testnet",
  explore: "https://sepolia.etherscan.io/",
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_info",
          "type": "string"
        }
      ],
      "name": "add_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_ipfs",
          "type": "string"
        }
      ],
      "name": "addDocHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_newInfo",
          "type": "string"
        }
      ],
      "name": "alter_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_exporter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "addHash",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        }
      ],
      "name": "delete_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "deleteHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "count_Exporters",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "count_hashes",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "findDocHash",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        }
      ],
      "name": "getExporterInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
};

// Add this function to check if current user is admin
function isAdmin() {
    return window.userAddress && window.userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
}

// Add this function to update UI based on admin status
function updateAdminUI() {
    if (isAdmin()) {
        // Show admin features
        $("#adminSection").show();
        $(".admin-only").show();
        $("#adminBadge").html('<span class="badge bg-success">Admin Access</span>');
    } else {
        // Hide admin features
        $("#adminSection").hide();
        $(".admin-only").hide();
        $("#adminBadge").html('');
    }
}

// Add this function to check if address is an exporter
async function isExporter(address) {
    try {
        const info = await window.contract.methods.getExporterInfo(address).call();
        // If the address is not an exporter, getExporterInfo returns an empty string
        return info && info.length > 0;
    } catch (error) {
        console.error("Error checking exporter status:", error);
        return false;
    }
}

//login
async function connect() {
  if (window.ethereum) {
    try {
      const selectedAccount = await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => accounts[0])
        .catch(() => {
          throw Error("No account selected 👍");
        });

      window.userAddress = selectedAccount;
      console.log(selectedAccount);
      window.localStorage.setItem("userAddress", window.userAddress);
      
      // Check admin and exporter status and update UI
      updateAdminUI();
      updateUI();

    } catch (error) {
      console.error("Connection error:", error);
    }
  } else {
    $("#upload_file_button").attr("disabled", true);
    $("#doc-file").attr("disabled", true);
    // Show The Warning for not detecting wallet
    document.querySelector(".alert").classList.remove("d-none");
  }
}

window.onload = async () => {
  if (window.ethereum) {
    // Initialize Web3
    window.web3 = new Web3(window.ethereum);

    // Initialize Contract
    window.contract = new window.web3.eth.Contract(
      window.CONTRACT.abi,
      window.CONTRACT.address
    );

    // Check if user is already connected
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      window.userAddress = accounts[0];
      updateAdminUI();
      updateUI();
    } else {
      $("#loginButton").show();
      $("#logoutButton").hide();
    }

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        window.userAddress = accounts[0];
        updateAdminUI();
        updateUI();
      } else {
        disconnect();
      }
    });

    // Listen for network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  } else {
    alert('Please install MetaMask!');
  }
};

async function updateUI() {
  $("#loginButton").hide();
  $("#logoutButton").show();
  $("#userAddress").html(`<i class="fa-solid fa-address-card mx-2 text-primary"></i>${truncateAddress(window.userAddress)}`);

  // Get and display network
  const chainId = await web3.eth.getChainId();
  const networkName = getNetworkName(chainId);
  $("#network").html(`Network: <span class="text-warning">${networkName}</span>`);

  // Get and display balance
  const balance = await web3.eth.getBalance(window.userAddress);
  const etherBalance = web3.utils.fromWei(balance, 'ether');
  $("#userBalance").html(`Balance: <span class="text-warning">${parseFloat(etherBalance).toFixed(4)} ETH</span>`);

  // Check and display exporter status
  const isUserExporter = await isExporter(window.userAddress);
  if (isUserExporter) {
    $("#Exporter-info").html(`<span class="badge bg-success">Authorized Exporter</span>`);
    $("#upload_file_button").attr("disabled", false);
  } else {
    $("#Exporter-info").html(`<span class="badge bg-danger">Not Authorized</span>`);
    $("#upload_file_button").attr("disabled", true);
  }

  // Hide loader if present
  $(".loader-wraper").fadeOut("slow");
}

function getNetworkName(chainId) {
  switch (chainId) {
    case 1:
      return 'Ethereum Main Network (Mainnet)';
    case 3:
      return 'Ropsten Test Network';
    case 4:
      return 'Rinkeby Test Network';
    case 5:
      return 'Goerli Test Network';
    case 42:
      return 'Kovan Test Network';
    case 137:
      return 'Polygon Mainnet';
    case 80001:
      return 'Polygon Test Network';
    case 11155111:
      return 'Sepolia Test Network'; // Sepolia Test Network
    default:
      return `Unknown Network (ID: ${chainId})`; // Display the chain ID for unknown networks
  }
}

function disconnect() {
  $("#loginButton").show();
  $("#logoutButton").hide();
  $("#userAddress").html('Address: <span class="text-warning">n/a</span>');
  $("#network").html('Network: <span class="text-warning">n/a</span>');
  $("#userBalance").html('Balance: <span class="text-warning">n/a</span>');
  window.userAddress = null;
}

async function verify_Hash() {
  //Show the loading
  $("#loader").show();

  if (window.hashedfile) {
    /*   I used the contract address (window.CONTRACT.address) as the caller of the function 'findDocHash'
        you can use any address because it used just for reading info from the contract
    */
    await contract.methods
      .findDocHash(window.hashedfile)
      .call({ from: window.userAddress })
      .then((result) => {
        $(".transaction-status").removeClass("d-none");
        window.newHash = result;
        if ((result[0] != 0) & (result[1] != 0)) {
          //Doc Verified
          print_verification_info(result, true);
        } else {
          //Doc not Verified
          print_verification_info(result, false);
        }
      });
  }
}

function checkURL() {
  let url_string = window.location.href;
  let url = new URL(url_string);
  window.hashedfile = url.searchParams.get("hash");
  if (!window.hashedfile) return;

  verify_Hash();
}
// get Sha3 Hash from the file
async function get_Sha3() {
  $("#note").html(`<h5 class="text-warning">Hashing Your Document 😴...</h5>`);
  $("#upload_file_button").attr("disabled", false);
  console.log("file changed");
  var file = await document.getElementById("doc-file").files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = async function (evt) {
      // var SHA256 = new Hashes.SHA256();
      // = SHA256.hex(evt.target.result);
      window.hashedfile = await web3.utils.soliditySha3(evt.target.result);
      console.log(`Document Hash : ${window.hashedfile}`);
      $("#note").html(
        `<h5 class="text-center text-info">Document Hashed  😎 </h5>`
      );
    };
    reader.onerror = function (evt) {
      console.log("error reading file");
      return false;
    };
  } else {
    window.hashedfile = null;
    return false;
  }
}

function print_verification_info(result, is_verified) {
  //Default Image for not Verified Docunets
  document.getElementById("student-document").src = "./files/notvalid.svg";
  $("#loader").hide();
  // when document not verfied
  if (!is_verified) {
    // document.getElementById('download-document').classList.add('d-none')
    $("#download-document").hide();
    $("#doc-status").html(`<h3 class="text-danger">
        Certificate not Verified 😕
         <i class="text-danger  fa fa-times-circle" aria-hidden="true"></i>
        </h3>`);
    $("#file-hash").html(
      `<span class="text-info"><i class="fa-solid fa-hashtag"></i></span> ${truncateAddress(
        window.hashedfile
      )}`
    );
    $("#college-name").hide();
    $("#contract-address").hide();
    $("#time-stamps").hide();
    $("#blockNumber").hide();
    $(".transaction-status").show();
  } else {
    $("#download-document").show();
    // when document verfied
    $("#college-name").show();
    $("#contract-address").show();
    $("#time-stamps").show();
    $("#blockNumber").show();

    var t = new Date(1970, 0, 1);
    t.setSeconds(result[1]);
    console.log(result[1]);
    t.setHours(t.getHours() + 3);
    // hide loader
    $("#loader").hide();
    $("#doc-status").html(`<h3 class="text-info">
         Certificate Verified Successfully 😊
         <i class="text-info fa fa-check-circle" aria-hidden="true"></i>
        </h3>`);
    $("#file-hash").html(
      `<span class="text-info"><i class="fa-solid fa-hashtag"></i></span> ${truncateAddress(
        window.hashedfile
      )}`
    );
    $("#college-name").html(
      `<span class="text-info"><i class="fa-solid fa-graduation-cap"></i></span> ${result[2]}`
    );
    $("#contract-address").html(
      `<span class="text-info"><i class="fa-solid fa-file-contract"></i> </span>${truncateAddress(
        window.CONTRACT.address
      )}`
    );
    $("#time-stamps").html(
      `<span class="text-info"><i class="fa-solid fa-clock"></i> </span>${t}`
    );
    $("#blockNumber").html(
      `<span class="text-info"><i class="fa-solid fa-cube"></i></span> ${result[0]}`
    );
    document.getElementById(
      "student-document"
    ).src = `https://ipfs.io/ipfs/${result[3]}`;
    document.getElementById("download-document").href =
      document.getElementById("student-document").src;
    $(".transaction-status").show();
  }
}

function hide_txInfo() {
  $(".transaction-status").addClass("d-none");
}

function show_txInfo() {
  $(".transaction-status").removeClass("d-none");
}
async function get_ethBalance() {
  await web3.eth.getBalance(window.userAddress, function (err, balance) {
    if (err === null) {
      $("#userBalance").html(
        "<i class='fa-brands fa-gg-circle mx-2 text-danger'></i>" +
          web3.utils.fromWei(balance).substr(0, 6) +
          ""
      );
    } else $("#userBalance").html("n/a");
  });
}

if (window.ethereum) {
  window.ethereum.on("accountsChanged", function (accounts) {
    connect();
  });
}

function printUploadInfo(result) {
  $("#transaction-hash").html(
    `<a target="_blank" title="View Transaction at Polygon Scan" href="${window.CONTRACT.explore}/tx/` +
      result.transactionHash +
      '"+><i class="fa fa-check-circle font-size-2 mx-1 text-white mx-1"></i></a>' +
      truncateAddress(result.transactionHash)
  );
  $("#file-hash").html(
    `<i class="fa-solid fa-hashtag mx-1"></i> ${truncateAddress(
      window.hashedfile
    )}`
  );
  $("#contract-address").html(
    `<i class="fa-solid fa-file-contract mx-1"></i> ${truncateAddress(
      result.to
    )}`
  );
  $("#time-stamps").html('<i class="fa-solid fa-clock mx-1"></i>' + getTime());
  $("#blockNumber").html(
    `<i class="fa-solid fa-link mx-1"></i>${result.blockNumber}`
  );
  $("#blockHash").html(
    `<i class="fa-solid fa-shield mx-1"></i> ${truncateAddress(
      result.blockHash
    )}`
  );
  $("#to-netowrk").html(
    `<i class="fa-solid fa-chart-network"></i> ${window.chainID}`
  );
  $("#to-netowrk").hide();
  $("#gas-used").html(
    `<i class="fa-solid fa-gas-pump mx-1"></i> ${result.gasUsed} Gwei`
  );
  $("#loader").addClass("d-none");
  $("#upload_file_button").addClass("d-block");
  show_txInfo();
  get_ethBalance();

  $("#note").html(`<h5 class="text-info">
   Transaction Confirmed to the BlockChain 😊<i class="mx-2 text-info fa fa-check-circle" aria-hidden="true"></i>
   </h5>`);
  listen();
}

async function getFilebinInfo(filebinUrl, filebinId) {
  try {
    const response = await fetch(
      `https://api.pdfrest.com/resource/${window.hashedfile}?format=url`,
      {
        method: "GET",
        headers: {},
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to retrieve file information:",
        await response.text()
      );
    }

    const data = await response.json();
    console.log(data); // This should contain information about the uploaded file
    return data;
  } catch (error) {
    console.error("Error fetching file information:", error);
    throw error; // Re-throw for potential handling in calling code
  }
}

async function uploadFileToIpfs() {
  const fileInput = document.getElementById("doc-file"); // Assuming you have an input element with id 'doc-file' for selecting files
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  //for authinticating your request to infura.io
  const auth = "Basic " + btoa(`${projectId}:${projectSecret}`);

  try {
    //make post request to upload the file and get the CID
    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: auth,
      },
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    console.log(data["Hash"]); // Response data
    //return the CID to the addDocHash to store it in the Contract
    return data["Hash"];
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Modify the sendHash function to check for exporter status
async function sendHash() {
  try {
    // Check if user is an exporter
    if (!await isExporter(window.userAddress)) {
      $("#note").html(`<h5 class="text-danger">Only authorized exporters can upload documents</h5>`);
      return;
    }

    // Early validation
    if (!window.hashedfile || window.hashedfile.length <= 4) {
      $("#note").html(`<h5 class="text-center text-warning">Please select a valid file first</h5>`);
      return;
    }

    // Update UI immediately
    $("#loader").removeClass("d-none");
    $("#upload_file_button").slideUp();
    $("#upload_file_button").attr("disabled", true);
    $("#note").html(`<h5 class="text-info">Preparing transaction...</h5>`);

    // Start IPFS upload and chain ID check in parallel
    const [CID, _] = await Promise.all([
      uploadFileToIpfs(),
      get_ChainID()
    ]);

    // Trigger transaction prompt immediately after getting CID
    await window.contract.methods
      .addDocHash(window.hashedfile, CID)
      .send({ from: window.userAddress })
      .on("transactionHash", function (_hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined...</h5>`
        );
      })
      .on("receipt", function (receipt) {
        printUploadInfo(receipt);
        generateQRCode();
      })
      .on("error", function (error) {
        console.error("Transaction error:", error);
        $("#note").html(`<h5 class="text-center">${error.message} 😏</h5>`);
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
        $("#upload_file_button").attr("disabled", false);
      });

  } catch (error) {
    console.error("Send hash error:", error);
    $("#note").html(`<h5 class="text-center text-danger">Error: ${error.message}</h5>`);
    $("#loader").addClass("d-none");
    $("#upload_file_button").slideDown();
    $("#upload_file_button").attr("disabled", false);
  }
}

//delete document hash from the contract
//only the exporter who add it can delete it
async function deleteHash() {
  $("#loader").removeClass("d-none");
  $("#upload_file_button").slideUp();
  $("#note").html(
    `<h5 class="text-info">Please confirm the transaction 🙂</h5>`
  );
  $("#upload_file_button").attr("disabled", true);
  get_ChainID();

  if (window.hashedfile) {
    await window.contract.methods
      .deleteHash(window.hashedfile)
      .send({ from: window.userAddress })
      .on("transactionHash", function (hash) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴</h5>`
        );
      })

      .on("receipt", function (receipt) {
        $("#note").html(
          `<h5 class="text-info p-1 text-center">Document Deleted 😳</h5>`
        );

        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
      })

      .on("confirmation", function (confirmationNr) {
        console.log(confirmationNr);
      })
      .on("error", function (error) {
        console.log(error.message);
        $("#note").html(`<h5 class="text-center">${error.message}</h5>`);
        $("#loader").addClass("d-none");
        $("#upload_file_button").slideDown();
      });
  }
}

//get current time
function getTime() {
  let d = new Date();
  a =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " - " +
    d.getHours() +
    ":" +
    d.getMinutes() +
    ":" +
    d.getSeconds();
  return a;
}

//get network name based on ID
async function get_ChainID() {
  let a = await web3.eth.getChainId();
  console.log(a);
  switch (a) {
    case 1:
      window.chainID = "Ethereum Main Network (Mainnet)";
      break;
    case 80001:
      window.chainID = "Polygon Test Network";
      break;
    case 137:
      window.chainID = "Polygon Mainnet";
      break;
    case 3:
      window.chainID = "Ropsten Test Network";
      break;
    case 4:
      window.chainID = "Rinkeby Test Network";
      break;
    case 5:
      window.chainID = "Goerli Test Network";
      break;
    case 42:
      window.chainID = "Kovan Test Network";
      break;
    default:
      window.chainID = "Uknnown ChainID";
      break;
  }
  let network = document.getElementById("network");
  if (network) {
    document.getElementById(
      "network"
    ).innerHTML = `<i class="text-info fa-solid fa-circle-nodes mx-2"></i>${window.chainID}`;
  }
}

function get_Sha3() {
  hide_txInfo();
  $("#note").html(`<h5 class="text-warning">Hashing Your Document 😴...</h5>`);

  $("#upload_file_button").attr("disabled", false);

  console.log("file changed");

  var file = document.getElementById("doc-file").files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
      // var SHA256 = new Hashes.SHA256();
      // = SHA256.hex(evt.target.result);
      window.hashedfile = web3.utils.soliditySha3(evt.target.result);
      console.log(`Document Hash : ${window.hashedfile}`);
      $("#note").html(
        `<h5 class="text-center text-info">Document Hashed  😎 </h5>`
      );
    };
    reader.onerror = function (evt) {
      console.log("error reading file");
    };
  } else {
    window.hashedfile = null;
  }
}

//logout
function disconnect() {
  $("#logoutButton").hide();
  $("#loginButton").show();
  window.userAddress = null;
  $(".wallet-status").addClass("d-none");
  window.localStorage.setItem("userAddress", null);
  $("#upload_file_button").addClass("disabled");
}

//shortcut wallet address
function truncateAddress(address) {
  if (!address) {
    return;
  }
  return `${address.substr(0, 7)}...${address.substr(
    address.length - 8,
    address.length
  )}`;
}

// Modify your addExporter function to include admin check
async function addExporter() {
  if (!isAdmin()) {
    $("#note").html(`<h5 class="text-danger">Only admin can add exporters</h5>`);
    return;
  }

  const address = document.getElementById("Exporter-address").value;
  const info = document.getElementById("info").value;

  if (!address || !info) {
    $("#note").html(`<h5 class="text-warning">Please provide both address and information</h5>`);
    return;
  }

  try {
    $("#loader").removeClass("d-none");
    $("#ExporterBtn").slideUp();
    $("#note").html(`<h5 class="text-info">Please confirm the transaction 👍...</h5>`);
    
    // Get gas estimate first
    const gasEstimate = await window.contract.methods
        .add_Exporter(address, info)
        .estimateGas({ from: window.userAddress });

    // Add 10% buffer to gas estimate
    const gasLimit = Math.round(gasEstimate * 1.1);

    // Get current gas price
    const gasPrice = await web3.eth.getGasPrice();

    await window.contract.methods
        .add_Exporter(address, info)
        .send({ 
            from: window.userAddress,
            gas: gasLimit,
            gasPrice: gasPrice
        })
        .on("transactionHash", function (hash) {
            $("#note").html(`<h5 class="text-info">Please wait for transaction to be mined 😴...</h5>`);
        })
        .on("receipt", function (receipt) {
            $("#loader").addClass("d-none");
            $("#ExporterBtn").slideDown();
            $("#note").html(`<h5 class="text-success">Exporter Added Successfully 😇</h5>`);
            
            // Log the actual gas used
            console.log("Gas used:", receipt.gasUsed);
        })
        .on("error", function (error) {
            console.error("Add exporter error:", error);
            $("#note").html(`<h5 class="text-danger">${error.message}</h5>`);
            $("#loader").addClass("d-none");
            $("#ExporterBtn").slideDown();
        });
  } catch (error) {
    console.error("Add exporter error:", error);
    $("#note").html(`<h5 class="text-danger">${error.message}</h5>`);
    $("#loader").addClass("d-none");
    $("#ExporterBtn").slideDown();
  }
}

// Add this helper function to format wei to ETH
function weiToEth(wei) {
    return web3.utils.fromWei(wei, 'ether');
}

// Add this function to estimate transaction cost
async function estimateAddExporterCost(address, info) {
    try {
        const gasEstimate = await window.contract.methods
            .add_Exporter(address, info)
            .estimateGas({ from: window.userAddress });
        
        const gasPrice = await web3.eth.getGasPrice();
        const totalCost = gasEstimate * gasPrice;
        
        console.log(`Estimated gas: ${gasEstimate}`);
        console.log(`Gas price: ${weiToEth(gasPrice)} ETH`);
        console.log(`Total cost: ${weiToEth(totalCost.toString())} ETH`);
        
        return totalCost;
    } catch (error) {
        console.error("Error estimating cost:", error);
        throw error;
    }
}

async function getExporterInfo() {
  await window.contract.methods
    .getExporterInfo(window.userAddress)
    .call({ from: window.userAddress })

    .then((result) => {
      window.info = result;
    });
}

async function getCounters() {
  await window.contract.methods
    .count_Exporters()
    .call({ from: window.userAddress })

    .then((result) => {
      $("#num-exporters").html(
        `<i class="fa-solid fa-building-columns mx-2 text-info"></i>${result}`
      );
    });
  await window.contract.methods
    .count_hashes()
    .call({ from: window.userAddress })

    .then((result) => {
      $("#num-hashes").html(
        `<i class="fa-solid fa-file mx-2 text-warning"></i>${result}`
      );
    });
}

async function editExporter() {
  const address = document.getElementById("Exporter-address").value;
  const info = document.getElementById("info").value;

  if (info && address) {
    $("#loader").removeClass("d-none");
    $("#ExporterBtn").slideUp();
    $("#edit").slideUp();
    $("#delete").slideUp();
    $("#note").html(
      `<h5 class="text-info">Please confirm the transaction 😴...</h5>`
    );
    $("#ExporterBtn").attr("disabled", true);
    get_ChainID();

    try {
      await window.contract.methods
        .alter_Exporter(address, info)
        .send({ from: window.userAddress })

        .on("transactionHash", function (hash) {
          $("#note").html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😇...</h5>`
          );
        })

        .on("receipt", function (receipt) {
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          console.log(receipt);
          $("#note").html(
            `<h5 class="text-info">Exporter Updated Successfully 😊</h5>`
          );
        })

        .on("confirmation", function (confirmationNr) {})
        .on("error", function (error) {
          console.log(error.message);
          $("#note").html(`<h5 class="text-center">${error.message} 👍</h5>`);
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
        });
    } catch (error) {
      $("#note").html(`<h5 class="text-center">${error.message} 👍</h5>`);
      $("#loader").addClass("d-none");
      $("#ExporterBtn").slideDown();
      $("#edit").slideDown();
      $("#delete").slideDown();
    }
  } else {
    $("#note").html(
      `<h5 class="text-center text-warning">You need to provide address & inforamtion to update 😵‍💫 </h5>`
    );
  }
}

// Modify your deleteExporter function to include admin check
async function deleteExporter() {
  if (!isAdmin()) {
    $("#note").html(`<h5 class="text-danger">Only admin can delete exporters</h5>`);
    return;
  }

  const address = document.getElementById("Exporter-address").value;

  if (address) {
    $("#loader").removeClass("d-none");
    $("#ExporterBtn").slideUp();
    $("#edit").slideUp();
    $("#delete").slideUp();
    $("#note").html(
      `<h5 class="text-info">Please confirm the transaction 😕...</h5>`
    );
    $("#ExporterBtn").attr("disabled", true);
    get_ChainID();

    try {
      await window.contract.methods
        .delete_Exporter(address)
        .send({ from: window.userAddress })

        .on("transactionHash", function (hash) {
          $("#note").html(
            `<h5 class="text-info p-1 text-center">Please wait for transaction to be mined 😴 ...</h5>`
          );
        })

        .on("receipt", function (receipt) {
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          $("#edit").slideDown();
          $("#delete").slideDown();
          console.log(receipt);
          $("#note").html(
            `<h5 class="text-info">Exporter Deleted Successfully 🙂</h5>`
          );
        })
        .on("error", function (error) {
          console.log(error.message);
          $("#note").html(`<h5 class="text-center">${error.message} 🙂</h5>`);
          $("#loader").addClass("d-none");
          $("#ExporterBtn").slideDown();
          $("#edit").slideDown();
          $("#delete").slideDown();
        });
    } catch (error) {
      $("#note").html(`<h5 class="text-center">${error.message} 🙂</h5>`);
      $("#loader").addClass("d-none");
      $("#ExporterBtn").slideDown();
      $("#edit").slideDown();
      $("#delete").slideDown();
    }
  } else {
    $("#note").html(
      `<h5 class="text-center text-warning">You need to provide address to delete 👍</h5>`
    );
  }
}

// Generate QR code so any one an Verify the documents
//note: if you r using local server you need to replace 127.0.0.1 with your machine local ip address got from the router
function generateQRCode() {
  document.getElementById("qrcode").innerHTML = "";
  console.log("making qr-code...");
  var qrcode = new QRCode(document.getElementById("qrcode"), {
    colorDark: "#000",
    colorLight: "#fff",
    correctLevel: QRCode.CorrectLevel.H,
  });
  if (!window.hashedfile) return;
  let url = `${window.location.host}/verify.html?hash=${window.hashedfile}`;
  qrcode.makeCode(url);
  document.getElementById("download-link").download =
    document.getElementById("doc-file").files[0].name;
  document.getElementById("verfiy").href =
    window.location.protocol + "//" + url;

  function makeDownload() {
    document.getElementById("download-link").href =
      document.querySelector("#qrcode img").src;
  }
  setTimeout(makeDownload, 500);
  //  makeDownload();
}

//check old transaction and show them if exist
//Transactions in last afew hours will show but very old transactions wont show
// cuz the pastEvents returns transactions in last 999 block
async function listen() {
  console.log("started...");
  if (window.location.pathname != "/upload.html") return;
  document.querySelector(".loading-tx").classList.remove("d-none");
  window.web3 = new Web3(window.ethereum);
  window.contract = new window.web3.eth.Contract(
    window.CONTRACT.abi,
    window.CONTRACT.address
  );

  await window.contract.getPastEvents(
    "addHash",
    {
      filter: {
        _exporter: window.userAddress, //Only get the documents uploaded by current Exporter
      },
      fromBlock: (await window.web3.eth.getBlockNumber()) - 999,
      toBlock: "latest",
    },
    function (error, events) {
      printTransactions(events);
      console.log(events);
    }
  );
}

//If there is past tx then show them
function printTransactions(data) {
  document.querySelector(".transactions").innerHTML = "";
  document.querySelector(".loading-tx").classList.add("d-none");
  if (!data.length) {
    $("#recent-header").hide();
    return;
  }
  const main = document.querySelector(".transactions");
  for (let i = 0; i < data.length; i++) {
    const a = document.createElement("a");
    a.href = `${window.CONTRACT.explore}` + "/tx/" + data[i].transactionHash;
    a.setAttribute("target", "_blank");
    a.className =
      "col-lg-3 col-md-4 col-sm-5 m-2  bg-dark text-light rounded position-relative card";
    a.style = "overflow:hidden;";
    const image = document.createElement("object");
    image.style = "width:100%;height: 100%;";

    image.data = `https://ipfs.io/ipfs/${data[i].returnValues[1]}`;
    const num = document.createElement("h1");
    num.append(document.createTextNode(i + 1));
    a.appendChild(image);
    num.style =
      "position:absolute; left:4px; bottom: -20px;font-size:4rem; color: rgba(20, 63, 74, 0.35);";
    a.appendChild(num);
    main.prepend(a);
  }
  $("#recent-header").show();
}
