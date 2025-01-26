import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedSubmissions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubmissions(fetchedSubmissions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);


  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return {
      formattedDate: date.toLocaleDateString('en-GB'),
      formattedTime: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      })
    };
  };

  const downloadPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    
    // Table columns
    const columns = [
      'First Name', 'Middle Name', 'Last Name', 'Gender', 'Email', 'Phone', 'Date of Birth',
      'Country of Origin', 'State of Origin', 'Country of Residence', 'State of Residence', 
      'City of Residence', 'Marital Status', 'Occupation', 'Learning Track', 'Computer Literacy',
      'Motivation', 'Have Laptop', 'Have Smartphone', 'Opportunity Source', 'Submitted At'
    ];

    // Table rows
    const data = submissions.map(submission => [
      submission.firstName,
      submission.middleName,
      submission.lastName,
      submission.gender,
      submission.email,
      submission.phone,
      submission.dateOfBirth,
      submission.countryOfOrigin,
      submission.stateOfOrigin, 
      submission.countryOfResidence,
      submission.stateOfResidence,
      submission.cityOfResidence,
      submission.maritalStatus,
      submission.occupation,
      submission.learningTrack,
      submission.computerLiteracy,
      submission.motivation,
      submission.haveLaptop,
      submission.haveSmartPhone,
      submission.opportunitySource,
      `${formatDate(submission.submittedAt).formattedDate} ${formatDate(submission.submittedAt).formattedTime}`
    ]);

    // Add summary
    doc.setFontSize(16);
    doc.text('Submission Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Submissions: ${submissions.length}`, 14, 22);

    // Generate table
    doc.autoTable({
      startY: 30,
      head: [columns],
      body: data,
      theme: 'grid',
      styles: { 
        cellPadding: 3,
        fontSize: 8,
        lineWidth: 0.5,
        lineColor: [200, 200, 200]
      }
    });

    doc.save('submissions_report.pdf');
  };

  if (loading) {
    return <div className="p-4 text-center">Loading submissions...</div>;
  }

  return (
   <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Submissions ({submissions.length})
          </h2>
          <button 
            onClick={downloadPDF}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
          >
            Download PDF
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Middle Name</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country of Origin</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State of Origin</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country of Residence</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State of Residence</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City of Residence</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marital Status</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupation</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Learning Track</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Computer Literacy</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivation</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Have Laptop</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Have Smartphone</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opportunity Source</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map(submission => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{submission.firstName}</td>
                  <td className="p-3 whitespace-nowrap">{submission.middleName}</td>
                  <td className="p-3 whitespace-nowrap">{submission.lastName}</td>
                  <td className="p-3 whitespace-nowrap">{submission.gender}</td>
                  <td className="p-3 whitespace-nowrap">{submission.email}</td>
                  <td className="p-3 whitespace-nowrap">{submission.phone}</td>
                  <td className="p-3 whitespace-nowrap">{submission.dateOfBirth}</td>
                  <td className="p-3 whitespace-nowrap">{submission.countryOfOrigin}</td>
                  <td className="p-3 whitespace-nowrap">{submission.stateOfOrigin}</td>
                  <td className="p-3 whitespace-nowrap">{submission.countryOfResidence}</td>
                  <td className="p-3 whitespace-nowrap">{submission.stateOfResidence}</td>
                  <td className="p-3 whitespace-nowrap">{submission.cityOfResidence}</td>
                  <td className="p-3 whitespace-nowrap">{submission.maritalStatus}</td>
                  <td className="p-3 whitespace-nowrap">{submission.occupation}</td>
                  <td className="p-3 whitespace-nowrap">{submission.learningTrack}</td>
                  <td className="p-3 whitespace-nowrap">{submission.computerLiteracy}</td>
                  <td className="p-3 whitespace-nowrap">{submission.motivation}</td>
                  <td className="p-3 whitespace-nowrap">{submission.haveLaptop}</td>
                  <td className="p-3 whitespace-nowrap">{submission.haveSmartPhone}</td>
                  <td className="p-3 whitespace-nowrap">{submission.opportunitySource}</td>
                  <td className="p-3 whitespace-nowrap">
                    {formatDate(submission.submittedAt).formattedDate}{' '}
                    {formatDate(submission.submittedAt).formattedTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;