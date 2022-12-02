import React from 'react'
import styles from '../../styles/Home.module.scss'
import Link from 'next/link'


export default function Header() {
    const handleLogout = () => {
        if (window.confirm("Bạn muốn đăng xuất ??")) {

            localStorage.removeItem("keyZing");
            location.reload()
        }
    }
    return (
        <div className={styles.header}>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/login">Login</Link>
                </li>
                <li onClick={handleLogout}>
                    Logout
                </li>
            </ul>
        </div>
    )
}
