export function logAIRequest(
  type: 'chat' | 'image' | 'analysis',
  api: string,
  endpoint: string,
  model: string,
  prompt: string
): string {
  const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('\n' + '='.repeat(80));
  console.log(`[AI调用] ${type.toUpperCase()} - ${api}`);
  console.log(`[时间] ${new Date().toLocaleString()}`);
  console.log(`[模型] ${model}`);
  console.log(`[接口] ${endpoint}`);
  console.log(`[ID] ${id}`);
  console.log(`[提示词] ${prompt.substring(0, 500)}${prompt.length > 500 ? '...' : ''}`);
  console.log('='.repeat(80));
  
  return id;
}

export function logAIResponse(
  id: string,
  responseText?: string,
  duration: number = 0,
  success: boolean = true,
  error?: string
): void {
  console.log('\n' + '-'.repeat(80));
  console.log(`[AI响应] ID: ${id}`);
  console.log(`[耗时] ${duration}ms`);
  console.log(`[状态] ${success ? '成功' : '失败'}`);
  
  if (error) {
    console.log(`[错误] ${error}`);
  } else if (responseText) {
    console.log(`[响应内容] ${responseText.substring(0, 1000)}${responseText.length > 1000 ? '...' : ''}`);
  }
  
  console.log('-'.repeat(80));
}
