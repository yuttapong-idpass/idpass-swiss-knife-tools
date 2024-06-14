import React, { useEffect, useState } from "react";
import sharedService from "../../components/shared/share-api";

import "./PublicIP.css";
import Loading from "../../components/Loading/Loading";

const initialIp = {
  ip: "",
};

const PublicIP = () => {
  const [ipAddress, setIpAddress] = useState(initialIp);
  useEffect(() => {
    getGeolocation();
  }, []);

  const getGeolocation = () => {
    sharedService
      .getIpAddress()
      .then((data: any) => {
        const ip: { ip: string } = data?.data;
        setIpAddress(ip);
      })
      .catch((error: any) => {});
  };

  return (
    <div className="p-4 place-items-center w-full h-screen bg-primary">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <span className="block mb-2 text-lg font-medium text-primary">
            My IP Address
          </span>
        </div>
        <div className="block p-4 w-full rounded-lg bg-secondary">
          <div className="flex flex-col">
            <div className="flex flex-col gap-4 self-center">
              <div className="self-center">
                {!!ipAddress.ip ? (
                  <>
                    <span className="text-primary text-5xl mb-3">
                      {ipAddress.ip}
                    </span>
                  </>
                ) : (
                  <>
                    <Loading />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicIP;
