// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error DocCollection_NotApprovedForMarketplace();
error DocCollection_NotOwner();
error DocCollection_NotUploaded(address docAddress, uint256 tokenId);

contract DocCollection is ReentrancyGuard {
    struct Uploading {
        string title;
        address owner;
    }
    mapping(address => mapping(uint256 => Uploading)) private s_uploads;

    event DocDeleted(address indexed owner, address indexed docAddress, uint256 indexed tokenId);

    event DocUploaded(
        address indexed owner,
        address indexed docAddress,
        uint256 indexed tokenId,
        string title
    );

    modifier isUploaded(address docAddress, uint256 tokenId) {
        Uploading memory uploading = s_uploads[docAddress][tokenId];
        if (bytes(uploading.title).length <= 0) {
            revert DocCollection_NotUploaded(docAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address docAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 doc = IERC721(docAddress);
        address owner = doc.ownerOf(tokenId);
        if (spender != owner) {
            revert DocCollection_NotOwner();
        }
        _;
    }

    ///////////////////
    ///main function///
    ///////////////////

    function uploadDoc(
        address docAddress,
        uint256 tokenId,
        string memory title
    ) external isOwner(docAddress, tokenId, msg.sender) {
        IERC721 doc = IERC721(docAddress);
        if (doc.getApproved(tokenId) != address(this)) {
            revert DocCollection_NotApprovedForMarketplace();
        }
        s_uploads[docAddress][tokenId] = Uploading(title, msg.sender);
        emit DocUploaded(msg.sender, docAddress, tokenId, title);
    }

    function deleteDocument(address docAddress, uint256 tokenId)
        external
        isOwner(docAddress, tokenId, msg.sender)
        isUploaded(docAddress, tokenId)
    {
        delete (s_uploads[docAddress][tokenId]);
        emit DocDeleted(msg.sender, docAddress, tokenId);
    }

    function getUploads(address docAddress, uint256 tokenId)
        external
        view
        returns (Uploading memory)
    {
        return s_uploads[docAddress][tokenId];
    }
}
