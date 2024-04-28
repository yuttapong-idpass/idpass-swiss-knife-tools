import React, { useEffect, useState } from "react";
import sharedService from "../../components/shared/share-api";
import { IGeolocation } from "../../model/geolocation.model";

import "./PublicIP.css";

const initialGeolocation: IGeolocation = {
  as: "",
  city: "",
  country: "",
  countryCode: "",
  isp: "",
  lat: 0,
  lon: 0,
  org: "",
  query: "0.0.0.0",
  region: "",
  regionName: "",
  status: "",
  timezone: "",
  zip: "",
};

const PublicIP = () => {
  const [ipAddress, setIpAddress] = useState(initialGeolocation);
  useEffect(() => {
    getGeolocation();
  }, []);

  const getGeolocation = () => {
    sharedService
      .getIpAddress()
      .then((data: any) => {
        const geolocation: IGeolocation = data?.data;
        if (geolocation.status === "success") {
          setIpAddress(geolocation);
        }
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
                <span className="text-primary text-5xl mb-3">
                  {ipAddress.query}
                </span>
              </div>
              <div>
                <span className="text-primary text-xl">Information</span>
                {ipAddress.status === "success" ? (
                  <>
                    <table className="border-collapse border border-slate-500 table-auto text-primary">
                      <tbody>
                        <tr>
                          <td className="border border-slate-600 p-4">As</td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.as}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">City</td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.city}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">
                            Country
                          </td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.country}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">
                            CountryCode
                          </td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.countryCode}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">Isp</td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.isp}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">Lat</td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.lat}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">Lon</td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.lon}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">Org</td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.org}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">IPV4/IPV6</td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.query}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">
                            Region
                          </td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.region}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">
                            RegionName
                          </td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.regionName}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">
                            Time zone
                          </td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.timezone}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-600 p-4">
                            Zip code
                          </td>
                          <td className="border border-slate-600 p-4">
                            {ipAddress.zip}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>
                    <span className="loader text-primary"></span>
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
