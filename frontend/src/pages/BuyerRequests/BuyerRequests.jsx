import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { getBuyerRequests } from "../../services/requestService";
import "./BuyerRequests.css";

function BuyerRequests() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchBuyerRequests();
  }, []);

  const fetchBuyerRequests = async () => {

    try {

      const data = await getBuyerRequests();

      setRequests(data.requests);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <>
      <Navbar />

      <div className="buyer-container">

        <h1>My Purchase Requests</h1>

        {requests.length === 0 ? (

          <h3 className="no-request">
            You haven't requested any books yet.
          </h3>

        ) : (

          <div className="buyer-grid">

            {requests.map((request) => (

              <div
                className="buyer-card"
                key={request._id}
              >

                <h2>{request.book.title}</h2>

                <p>
                  <strong>Author:</strong>{" "}
                  {request.book.author}
                </p>

                <p>
                  <strong>Seller:</strong>{" "}
                  {request.seller.name}
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

                {request.status === "Accepted" && (
                  <>
                    <p>
                      <strong>Email:</strong>{" "}
                      {request.seller.email}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {request.seller.phone}
                    </p>

                    <p>
                      <strong>Pickup Address:</strong>{" "}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          request.book.pickupAddress
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {request.book.pickupAddress}
                      </a>
                    </p>
                  </>
                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </>

  );

}

export default BuyerRequests;