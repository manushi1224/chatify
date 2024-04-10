export default function ResponseButtons({
  handleAccept,
  handleDecline,
  ntfn,
  request,
  handleDelete,
  fetchAllConversationByUser,
}) {
  switch (request) {
    case "request":
      return (
        <div className="flex gap-3 mt-2">
          <button
            className="btn btn-sm btn-success"
            onClick={() => {
              handleAccept(ntfn.senderId, ntfn._id);
            }}
          >
            accept
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDecline(ntfn._id, ntfn.senderId)}
          >
            decline
          </button>
        </div>
      );

    case "accepted":
      return (
        <div className="flex gap-3 mt-2" key={ntfn._id}>
          <button
            className="btn btn-sm btn-success"
            onClick={() => fetchAllConversationByUser(ntfn._id)}
          >
            Chat!!
          </button>
        </div>
      );
    case "notification":
      return (
        <div className="flex gap-3 mt-2" key={ntfn._id}>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleDelete(ntfn._id)}
          >
            OK
          </button>
        </div>
      );
    default:
      return (
        <div className="flex gap-3 mt-2" key={ntfn._id}>
          <button
            className="btn btn-sm btn-success"
            onClick={() => handleDelete(ntfn._id)}
          >
            OK
          </button>
        </div>
      );
  }
}
