import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/constants/route.paths';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Row,
  Col,
  Dropdown,
  Modal,
  message,
  Tooltip,
  Badge,
  Typography,
  Flex,
} from 'antd';
import type { TableProps, MenuProps } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  FilterOutlined,
  ReloadOutlined,
  MoreOutlined,
  SearchOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons';
import type { Lead, LeadStatusValue, LeadRatingValue, LeadSourceValue } from '@/types/lead.types';
import {
  LeadStatus,
  getLeadStatusLabel,
  getLeadSourceLabel,
  getLeadRatingLabel,
  getLeadStatusColor,
  getLeadRatingColor,
  leadStatusOptions,
  leadRatingOptions,
  leadSourceOptions,
  leadStatusFilters,
  leadRatingFilters,
} from '@/types/lead.types';
import { useLeadStore } from '@/stores/lead.store';
import leadService from '@/services/lead.service';

const { Title, Text } = Typography;
const { Search } = Input;

const LeadList: React.FC = () => {

  const navigate = useNavigate();
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const {
    leads,
    total,
    page,
    pageSize,
    loading,
    error,
    filters,
    selectedRowKeys,
    fetchLeads,
    setPage,
    setPageSize,
    setFilters,
    resetFilters,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    bulkDeleteLeads,
    bulkUpdateStatus,
  } = useLeadStore();




  // Fetch leads on mount
  // useEffect(() => {
  //   fetchLeads();
  // }, [fetchLeads]);

  // Show error message
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <div >
     Deneme 4
    </div>
  );
};

export default LeadList;
