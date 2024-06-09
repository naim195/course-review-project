import { useState } from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuList,
  MenuItem,
  Collapse,
} from "@material-tailwind/react";
import SchoolIcon from "@mui/icons-material/School";
import PropTypes from "prop-types";

const pages = ["Courses", "Instructors"];
const settings = ["Logout"];

const ResponsiveAppBar = ({ user, handleGoogleSignIn, handleLogout }) => {
  const [openNav, setOpenNav] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const handleOpenUserMenu = (event) => {
    setOpenUserMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleCloseUserMenu();
  };

  return (
    <Navbar className="mx-auto mb-10 max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <div className="flex items-center">
          <SchoolIcon className="h-6 w-6 text-inherit mr-2" />
          <Typography
            as="a"
            href="/"
            className="mr-4 cursor-pointer py-1.5 font-medium"
          >
            COURSE-REVIEW
          </Typography>
        </div>
        <div className="hidden lg:block">
          <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            {pages.map((page) => (
              <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium"
                key={page}
              >
                <a href="#" className="flex items-center">
                  {page}
                </a>
              </Typography>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-x-1">
          {user ? (
            <div className="flex items-center">
              <IconButton
                variant="text"
                className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
                onClick={handleOpenUserMenu}
              >
                <Avatar
                  alt="User Avatar"
                  src="/static/images/avatar/2.jpg"
                  size="sm"
                />
              </IconButton>
              <Menu
                open={openUserMenu}
                handler={handleOpenUserMenu}
                onClick={handleCloseUserMenu}
              >
                <MenuList className="w-max max-w-screen-xs">
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={setting === "Logout" ? handleLogoutClick : null}
                    >
                      <Typography variant="small" className="font-normal">
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
          ) : (
            <Button
              variant="text"
              size="sm"
              onClick={handleGoogleSignIn}
              className="hidden lg:inline-block"
            >
              <span>Sign in</span>
            </Button>
          )}
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
            {pages.map((page) => (
              <Typography
                as="li"
                variant="small"
                color="blue-gray"
                className="flex items-center gap-x-2 p-1 font-medium"
                key={page}
              >
                <a href="#" className="flex items-center">
                  {page}
                </a>
              </Typography>
            ))}
          </ul>
          {user ? (
            <div className="flex items-center gap-x-1">
              <IconButton
                variant="text"
                className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent"
                onClick={handleOpenUserMenu}
              >
                <Avatar
                  alt="User Avatar"
                  src="/static/images/avatar/2.jpg"
                  size="sm"
                />
              </IconButton>
              <Menu
                open={openUserMenu}
                handler={handleOpenUserMenu}
                onClick={handleCloseUserMenu}
              >
                <MenuList className="w-max max-w-screen-xs">
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={setting === "Logout" ? handleLogoutClick : null}
                    >
                      <Typography variant="small" className="font-normal">
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
          ) : (
            <Button
              fullWidth
              variant="text"
              size="sm"
              onClick={handleGoogleSignIn}
              className=""
            >
              <span>Sign in</span>
            </Button>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
};

const userShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  googleId: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  reviews: PropTypes.array.isRequired,
  __v: PropTypes.number.isRequired,
});

ResponsiveAppBar.propTypes = {
  user: userShape,
  handleGoogleSignIn: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default ResponsiveAppBar;
