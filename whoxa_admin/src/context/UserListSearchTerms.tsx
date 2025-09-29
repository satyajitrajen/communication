// @ts-nocheck
import { createContext, useState } from "react";

export const UserListSearchTermsContext = createContext({
    searchBy: "",
    fullName: "",
    phoneNumber: "",
    setSearchBy: (searchBy) => { },
    setFullName: (fullName) => { },
    setPhoneNumber: (phoneNumber) => { }
});

export default function UserListSearchTermsCn({ children }) {
    const [searchBy, setSearchBy] = useState("");
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    return (
        <UserListSearchTermsContext.Provider value={{ searchBy, setSearchBy, fullName, setFullName, phoneNumber, setPhoneNumber }}>
            {children}
        </UserListSearchTermsContext.Provider>
    );
}
