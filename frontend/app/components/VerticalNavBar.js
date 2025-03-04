import Link from 'next/link';
import Image from 'next/image';

export default function VerticalNavBar() {
  return (
    <nav className="vertical-nav">
        <div className="logo-container">
            <Image src="/Logo_Improved_bg_removed.png" alt="Logo" width={200} height={200} />
        </div>
      <ul>
        <li>
          <Link href="/account-settings">Account Settings</Link>
        </li>
    </ul>
    <ul>
        <li>
          <Link href="/my-files">My Files</Link>
        </li>
    </ul>
    <ul>
        <li>
          <Link href="/my-appointments">My Appointments</Link>
        </li>
      </ul>
    </nav>
  );
}

