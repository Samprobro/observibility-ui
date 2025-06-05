import ReactFlow, {
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from 'reactflow';
import { Background } from '@reactflow/background';
import { Controls } from '@reactflow/controls';
import { MiniMap } from '@reactflow/minimap';
import 'reactflow/dist/style.css';

interface WorkflowStage {
  id: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp: string | null;
  details: Record<string, string | number>;
}

interface WorkflowData {
  orderId: string;
  stages: WorkflowStage[];
}

// Sample workflow data for an order
const sampleWorkflow: WorkflowData = {
  orderId: "ORD-123456",
  stages: [
    {
      id: "order-received",
      status: "completed",
      timestamp: "2024-03-05T10:00:00Z",
      details: {
        customer: "John Doe",
        total: "$599.99",
        items: 3
      }
    },
    {
      id: "payment-processing",
      status: "completed",
      timestamp: "2024-03-05T10:01:00Z",
      details: {
        method: "Credit Card",
        transaction: "TXN-789012"
      }
    },
    {
      id: "inventory-check",
      status: "completed",
      timestamp: "2024-03-05T10:02:00Z",
      details: {
        warehouse: "NYC-01",
        availability: "In Stock"
      }
    },
    {
      id: "packaging",
      status: "completed",
      timestamp: "2024-03-05T10:15:00Z",
      details: {
        package: "Standard Box",
        weight: "2.5 kg"
      }
    },
    {
      id: "shipping",
      status: "in-progress",
      timestamp: "2024-03-05T10:30:00Z",
      details: {
        carrier: "FedEx",
        tracking: "FDX123456789"
      }
    },
    {
      id: "delivery",
      status: "pending",
      timestamp: null,
      details: {
        eta: "2024-03-07",
        address: "123 Main St"
      }
    }
  ]
};

interface NodeData {
  label: string;
  status: WorkflowStage['status'];
  timestamp: string | null;
  details: Record<string, string | number>;
}

// Custom node styles
const getNodeStyle = (status: WorkflowStage['status']) => {
  const baseStyle = {
    padding: 20,
    borderRadius: 8,
    border: '1px solid #ccc',
    width: 250,
  };

  switch (status) {
    case 'completed':
      return {
        ...baseStyle,
        background: '#dcfce7',
        borderColor: '#22c55e',
      };
    case 'in-progress':
      return {
        ...baseStyle,
        background: '#fef9c3',
        borderColor: '#eab308',
      };
    default:
      return {
        ...baseStyle,
        background: '#f3f4f6',
        borderColor: '#9ca3af',
      };
  }
};

// Custom node component
const CustomNode: React.FC<{ data: NodeData }> = ({ data }) => {
  const style = getNodeStyle(data.status);
  
  return (
    <div style={style}>
      <div className="font-medium text-gray-900 mb-2">{data.label}</div>
      <div className="text-sm text-gray-600">
        {data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Pending'}
      </div>
      <div className="mt-2 text-sm">
        {Object.entries(data.details).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center text-gray-600">
            <span className="capitalize">{key}:</span>
            <span className="font-medium">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Generate nodes and edges from workflow data
const generateNodesAndEdges = (workflow: typeof sampleWorkflow) => {
  const nodes: Node[] = workflow.stages.map((stage, index) => ({
    id: stage.id,
    type: 'custom',
    position: { x: index * 300, y: 0 },
    data: {
      label: stage.id.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      status: stage.status,
      timestamp: stage.timestamp,
      details: stage.details,
    },
  }));

  const edges: Edge[] = workflow.stages.slice(0, -1).map((_, index) => ({
    id: `e${index}-${index + 1}`,
    source: workflow.stages[index].id,
    target: workflow.stages[index + 1].id,
    type: 'smoothstep',
    animated: workflow.stages[index].status === 'in-progress',
    style: {
      stroke: '#94a3b8',
      strokeWidth: 2,
    },
  }));

  return { nodes, edges };
};

export default function WorkflowDiagram() {
  const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(sampleWorkflow);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = {
    custom: CustomNode as React.ComponentType<{ data: NodeData }>,
  } as NodeTypes;

  return (
    <div className="h-[600px] border border-gray-200 rounded-lg bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
} 