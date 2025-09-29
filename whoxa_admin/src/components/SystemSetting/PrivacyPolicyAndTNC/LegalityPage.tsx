import React from 'react'
import { Link } from 'react-router-dom'
import EditPrivacyPolicy from './EditPrivacyPolicy'
import EditTermsConditions from './EditTNC'

function LegalityPage() {
    return (
        <div className="mt-6">
            <ul className="flex space-x-2 rtl:space-x-reverse text-sm text-gray-700">
                <li>
                    <Link to="#" className="text-blue-500 hover:underline">
                        System Settings
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2 text-gray-500">
                    <span>Pages</span>
                </li>
            </ul>
            <EditPrivacyPolicy/>
            <EditTermsConditions/>
        </div>)
}

export default LegalityPage