import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {getMyRequests,updateRequestStatus,} from "../../services/requestService";
import toast from "react-hot-toast";
import "./PurchaseRequests.css";

function PurchaseRequests() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
   fetchRequests();
  }, []);

  const fetchRequests = async () => {

    try {

      const data = await getMyRequests();

      setRequests(data.requests);

    } catch (error) {

      console.log(error);

    }

  };

  const handleStatus = async (id, status) => {

    try {

      await updateRequestStatus(id, status);

      toast.success(`Request ${status}`);

      fetchRequests();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }

  };

  // Remove orphan requests whose book has been deleted
  const validRequests = requests.filter(
    (request) => request.book
  );

  return (
    <>
      <Navbar />

      <div className="requests-container">

        <h1>Purchase Requests</h1>

        {validRequests.length === 0 ? (

          <h3 className="no-request">
            No Purchase Requests Yet.
          </h3>

        ) : (

          <div className="requests-grid">

            {validRequests.map((request) => (

              <div
                className="request-card"
                key={request._id}
              >

                <h2>{request.book?.title}</h2>

                <p>
                  <strong>Buyer:</strong>{" "}
                  {request.buyer?.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {request.buyer?.email}
                </p>

                <p>
                  <strong>Status:</strong>

                  <span
                    className={`status ${request.status.toLowerCase()}`}
                  >
                    {" "}
                    {request.status}
                  </span>

                </p>

                {request.status === "Pending" && (

                  <div className="request-actions">

                    <button
                      className="accept-btn"
                      onClick={() =>
                        handleStatus(
                          request._id,
                          "Accepted"
                        )
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleStatus(
                          request._id,
                          "Rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </>
  );

}

export default PurchaseRequests;