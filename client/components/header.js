import Link from "next/link";


function HeaderComponent({ currentUser }) {

    const links = [
        !currentUser && { label: 'Sign Up', href: '/auth/signup' },
        !currentUser && { label: 'Sign In', href: '/auth/signin' },
        currentUser && { label: 'Sign Out', href: '/auth/signout' }
    ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => {
        return <Link key={href} href={href} className="nav-link px-2">{label}</Link>
    });

    return(
        <nav className="navbar navbar-light bg-light px-4">
            <Link href="/" className="navbar-brand px-2">
                GitTix
            </Link>
            
            <div className="d-flex justify-content-end">
                {links}
            </div>
        </nav>
    );
}

export default HeaderComponent;