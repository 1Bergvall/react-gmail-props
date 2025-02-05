import { useState } from 'react'

import initialEmails from './data/emails'

import './styles/App.css'

const getReadEmails = emails => emails.filter(email => !email.read)

const getStarredEmails = emails => emails.filter(email => email.starred)
function EmailDetails({email})
{
  return(
    <h1>{email}</h1>
  )
}
function EmailsComponent(props)
{

  return(
    <main className="emails">
        <ul>
          {props.filteredEmails.map((email, index) => (
            <li
              key={index}
              className={`email ${email.read ? 'read' : 'unread'}`}
              
            >
              <Email email={email} emails={props.emails} setEmails={props.setEmails} />
            </li>
          ))}
        </ul>
      </main>
  )
}
function Email({email, setEmails})
{
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleClick = (email) => {
    setSelectedEmail(email);
  };

  const closeModal = () => {
    setSelectedEmail(null); 
  };

  const toggleStar = targetEmail => {
    const updatedEmails = emails =>
      emails.map(email =>
        email.id === targetEmail.id
          ? { ...email, starred: !email.starred }
          : email
      )
    setEmails(updatedEmails)
  }

  const toggleRead = targetEmail => {
    const updatedEmails = emails =>
      emails.map(email =>
        email.id === targetEmail.id ? { ...email, read: !email.read } : email
      )
    setEmails(updatedEmails)
  }
  
  return(
    <>
        <div className="select">
          <input
            className="select-checkbox"
            type="checkbox"
            checked={email.read}
            onChange={() => toggleRead(email)}
          />
        </div>
        <div className="star">
          <input
            className="star-checkbox"
            type="checkbox"
            checked={email.starred}
            onChange={() => toggleStar(email)}
          />
        </div>
        <div className="sender" onClick={() => handleClick(email)}>{email.sender}</div>
        <div className="title"  onClick={() => handleClick(email)}>{email.title}</div>

        {selectedEmail && (
        <div className="email-modal">
          <div className="modal-content">
            <h2>Email Details</h2>
            <p><strong>Subject:</strong> {selectedEmail.title}</p>
            <p><strong>From:</strong> {selectedEmail.sender}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
    

  )
}

function App() {
  const [emails, setEmails] = useState(initialEmails)
  const [hideRead, setHideRead] = useState(false)
  const [currentTab, setCurrentTab] = useState('inbox')
  const [searchTerm, setSearchTerm] = useState("")

  const unreadEmails = emails.filter(email => !email.read)
  const starredEmails = emails.filter(email => email.starred)

  const handleSearchChange = (props) => {
    setSearchTerm(props.target.value)
  };

  let filteredEmails = emails

  if (hideRead) filteredEmails = getReadEmails(filteredEmails)

  if (currentTab === 'starred')
    filteredEmails = getStarredEmails(filteredEmails)
  
  if (searchTerm != "")
  {
    filteredEmails = filteredEmails.filter(email => email.title.toLowerCase().startsWith(searchTerm.toLowerCase()))
    
  }
  

  return (
    <div className="app">
      <header className="header">
        <div className="left-menu">
          <svg className="menu-icon" focusable="false" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>

          <img
            src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png"
            alt="gmail logo"
          />
        </div>

        <div className="search">
          <input className="search-bar" placeholder="Search mail" value={searchTerm} onChange={handleSearchChange} />
        </div>
      </header>
      <nav className="left-menu">
        <ul className="inbox-list">
          <li
            className={`item ${currentTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setCurrentTab('inbox')}
          >
            <span className="label">Inbox</span>
            <span className="count">{unreadEmails.length}</span>
          </li>
          <li
            className={`item ${currentTab === 'starred' ? 'active' : ''}`}
            onClick={() => setCurrentTab('starred')}
          >
            <span className="label">Starred</span>
            <span className="count">{starredEmails.length}</span>
          </li>

          <li className="item toggle">
            <label htmlFor="hide-read">Hide read</label>
            <input
              id="hide-read"
              type="checkbox"
              checked={hideRead}
              onChange={e => setHideRead(e.target.checked)}
            />
          </li>
        </ul>
      </nav>
      <EmailsComponent filteredEmails={filteredEmails} emails={emails} setEmails={setEmails}/>
    </div>
  )
}

export default App
