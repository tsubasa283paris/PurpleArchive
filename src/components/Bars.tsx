import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AppBar } from './AppBar';
import { Drawer, LocationLiteral } from './Drawer';

interface BarsProps {
  location: LocationLiteral;
}

export const Bars = (props: BarsProps) => {
  const [openDrawer, setOpenDrawer] = React.useState<boolean>(false);

  const navigate = useNavigate();

  const handleJumpBrowse = () => {
    navigate('/albums', { replace: true });
  };

  const handleJumpMyPage = () => {
    navigate('/mypage', { replace: true });
  };

  return (
    <React.Fragment>
      <AppBar
        open={openDrawer}
        onClickOpenDrawer={() => {
          setOpenDrawer(true);
        }}
      />
      <Drawer
        open={openDrawer}
        location={props.location}
        onClickCloseDrawer={() => {
          setOpenDrawer(false);
        }}
        onClickJumpBrowse={handleJumpBrowse}
        onClickJumpMyPage={handleJumpMyPage}
      />
    </React.Fragment>
  );
};
